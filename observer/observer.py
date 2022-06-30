#!/usr/bin/env python
# coding: utf-8

import socketio


client = socketio.Client()


class MapleinfoNamespace(socketio.ClientNamespace):
    def connect(self):
        print("I'm connected!")

    def connect_error(self):
        print("The connection failed!")

    def disconnect(self):
        print("I'm disconnected!")


client.register_namespace(MapleinfoNamespace('/mapleinfo'))
client.connect('http://localhost:4004', namespaces=['/mapleinfo'])


@client.on('healthCheckRes', namespace='/mapleinfo')
def health_check(data):
  print(data)


client.emit('healthCheck', namespace='/mapleinfo')


client.emit('changeChar', data={ 'char' : '챠르마' }, namespace='/mapleinfo')


# VJtEKlOrH_U


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

service = Service(ChromeDriverManager().install())
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
options = webdriver.ChromeOptions()
options.add_argument(f"user-agent: {user_agent}")
# options.add_argument("headless")
driver = webdriver.Chrome(service=service, options=options)
driver.set_window_size(1280, 1024)
driver.minimize_window()


import os
import datetime
import pymongo
import certifi
from dotenv import load_dotenv

load_dotenv()
ENV = os.getenv("ENV")
DBID = os.getenv("MONGODB_ID")
DBPW = os.getenv("MONGODB_PW")
atlas_link = f"mongodb+srv://{DBID}:{DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority"
dbclient = pymongo.MongoClient(atlas_link, tlsCAFile=certifi.where())


db = dbclient["chatlog"]
col = db[datetime.datetime.now().strftime("%Y-%m-%d")]


STREAMING_ID = 'VJtEKlOrH_U'
CHAT_ROOM = f"https://studio.youtube.com/live_chat?v={STREAMING_ID}"


def get_prev_chat():
  res_list = list(col.find({}, { "_id": 0 } ))
  prev_chat = [(chat['timestamp'], chat['author'], chat['message']) for chat in res_list]
  return prev_chat


def logging_chat(col, chats):
  rows = map(lambda x: {"timestamp": x[0], "author": x[1], "message": x[2]}, chats)
  col.insert_many(rows)


import time
import traceback
from bs4 import BeautifulSoup
prev_chat = get_prev_chat()
command_list = ['캐릭터']
while True:
  try:
    driver.get(CHAT_ROOM)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div#chat.yt-live-chat-renderer")))
    soup = BeautifulSoup(driver.page_source, "lxml")
    message_divs = [(x.select_one("#timestamp").text, x.select_one("#author-name").text, x.select_one("#message").text) 
                    for x in soup.select("yt-live-chat-text-message-renderer")]
    now_chats = [x for x in message_divs if x not in prev_chat]
    if now_chats:
      logging_chat(col, now_chats)
      prev_chat.extend(now_chats)
      new_commands = [chat for chat in now_chats if chat[2].split(' ')[0][0] == '!']
      if new_commands:
        queue = [chat for chat in new_commands if chat[2].split(' ')[0][1:] in command_list]
        if queue:
          print(queue)
          for i in queue:
            client.emit('changeChar', data={ 'char' : i[2].split(' ')[1] }, namespace='/mapleinfo')
            time.sleep(1)
          
    time.sleep(3)
  except:
    print('STOP')
    driver.quit()
    dbclient.close()
    client.disconnect()
    print(traceback.format_exc())
    break

