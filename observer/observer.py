#!/usr/bin/env python
# coding: utf-8

import sys
import os
import traceback
import time
import datetime
from multiprocessing import Queue, Process

import socketio
import pymongo
import certifi
from dotenv import load_dotenv

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from module import comsumer


load_dotenv()
client = socketio.Client()


WS_SERVER = os.getenv('WS_SERVER')
client.connect(WS_SERVER, namespaces=['/mapleinfo'])


@client.on('healthCheckRes', namespace='/mapleinfo')
def health_check(data):
  print(data)


client.emit('healthCheck', namespace='/mapleinfo')


options = webdriver.ChromeOptions()
driver = webdriver.Remote('http://172.17.0.3:4444', options=options)


ENV = os.getenv("ENV")
DBID = os.getenv("MONGODB_ID")
DBPW = os.getenv("MONGODB_PW")
atlas_link = f"mongodb+srv://{DBID}:{DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority"
dbclient = pymongo.MongoClient(atlas_link, tlsCAFile=certifi.where())


db = dbclient["chatlog"]
col = db[datetime.datetime.now().strftime("%Y-%m-%d")]


# STREAMING_ID = 'SFykddB0Paw'
STREAMING_ID = sys.argv[1]
CHAT_ROOM = f"https://studio.youtube.com/live_chat?v={STREAMING_ID}"
print(CHAT_ROOM)


def get_prev_chat():
  res_list = col.find({}, { "_id": 0, 'timestamp': 1, 'author': 1, 'message': 1 } )
  prev_chat = []
  for chat in res_list:
    prev_chat.append(tuple(chat.values()))
  return prev_chat


def get_timestamp(time_str, utc_now: datetime.datetime):
  year, month, day = utc_now.year, utc_now.month, utc_now.day
  hour_minute, meridiem = time_str.split(' ')[0], time_str.split(' ')[1]
  hour = int(hour_minute.split(':')[0])
  if meridiem == 'PM':
    hour += 12
  minute = int(hour_minute.split(':')[1])
  timestamp = datetime.datetime(year, month, day, hour, minute)
  return timestamp


def get_now_chats(soup, utc_now):
  message_divs = [(get_timestamp(x.select_one("#timestamp").text, utc_now), x.select_one("#author-name").text, x.select_one("#message").text) 
                  for x in soup.select("yt-live-chat-text-message-renderer")]
  now_chats = [x for x in message_divs if x not in prev_chat]
  print(now_chats)
  return now_chats


def logging_chat(col, chats, utc_now):
  rows = map(lambda x: {
    "timestamp": x[0],
    "log_time": utc_now,
    "author": x[1],
    "message": x[2]
    }, chats)
  col.insert_many(rows)
  return rows


prev_chat = get_prev_chat()
command = {
  '캐릭터': {
    '스탯': 'changeView'
  }
}


q = Queue()
emitter = Process(target=comsumer, args=(q, ))
emitter.start()


while True:
  try:
    driver.get(CHAT_ROOM)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div#chat.yt-live-chat-renderer")))
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    client.emit('aliveObserver', namespace='/mapleinfo')
    soup = BeautifulSoup(driver.page_source, "lxml")
    now_chats = get_now_chats(soup, utc_now)
    if now_chats:
      logging_chat(col, now_chats, utc_now)
      prev_chat.extend(now_chats)
      new_commands_chats = [chat for chat in now_chats if chat[2].split(' ')[0][0] == '!' and chat[2].split(' ')[0][1:] in command.keys()]
      for i in new_commands_chats:
        q.put(i)
    time.sleep(3)
  except:
    print('STOP')
    driver.quit()
    dbclient.close()
    client.disconnect()
    emitter.terminate()
    emitter.join()
    print(traceback.format_exc())
    break

