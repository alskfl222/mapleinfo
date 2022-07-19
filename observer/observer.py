#!/usr/bin/env python
# coding: utf-8

import sys
import os
import traceback
import time
import datetime
import socketio
import pymongo
import certifi
from dotenv import load_dotenv

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


print(sys.argv[1])
load_dotenv()
client = socketio.Client()
print("WEBSOCKET CLIENT INIT")


class MapleinfoNamespace(socketio.ClientNamespace):
    def connect(self):
        print("I'm connected!")

    def connect_error(self):
        print("The connection failed!")

    def disconnect(self):
        print("I'm disconnected!")


WS_SERVER = os.getenv('WS_SERVER')
print(WS_SERVER)
client.register_namespace(MapleinfoNamespace('/mapleinfo'))
client.connect(WS_SERVER, namespaces=['/mapleinfo'])
print("WEBSOCKET CONNECTED")

@client.on('healthCheckRes', namespace='/mapleinfo')
def health_check(data):
  print(data)


client.emit('healthCheck', namespace='/mapleinfo')


service = Service(ChromeDriverManager().install())
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
options = webdriver.ChromeOptions()
options.add_argument(f"user-agent: {user_agent}")
# options.add_argument("headless")
driver = webdriver.Chrome(service=service, options=options)
driver.set_window_size(1280, 1024)
driver.minimize_window()
print("DRIVER INIT")


try:
  ENV = os.getenv("ENV")
  DBID = os.getenv("MONGODB_ID")
  DBPW = os.getenv("MONGODB_PW")
  atlas_link = f"mongodb+srv://{DBID}:{DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority"
  dbclient = pymongo.MongoClient(atlas_link, tlsCAFile=certifi.where())
  print("DB CONNECTED")
except:
  print("FAIL: DB CONNECT")
  raise


db = dbclient["chatlog"]
col = db[datetime.datetime.now().strftime("%Y-%m-%d")]


STREAMING_ID = sys.argv[1]
CHAT_ROOM = f"https://studio.youtube.com/live_chat?v={STREAMING_ID}"


def get_prev_chat():
  res_list = list(col.find({}, { "_id": 0 } ))
  prev_chat = [(chat['timestamp'], chat['author'], chat['message']) for chat in res_list]
  return prev_chat


def logging_chat(col, chats):
  rows = map(lambda x: {"timestamp": x[0], "author": x[1], "message": x[2]}, chats)
  col.insert_many(rows)


prev_chat = get_prev_chat()
command = {
  '캐릭터': {
    '스탯': 'changeView'
  }
}
print('OBSERVING START')
while True:
  try:
    driver.get(CHAT_ROOM)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div#chat.yt-live-chat-renderer")))
    client.emit('aliveObserver', namespace='/mapleinfo')
    soup = BeautifulSoup(driver.page_source, "lxml")
    message_divs = [(x.select_one("#timestamp").text, x.select_one("#author-name").text, x.select_one("#message").text) 
                    for x in soup.select("yt-live-chat-text-message-renderer")]
    now_chats = [x for x in message_divs if x not in prev_chat]
    if now_chats:
      logging_chat(col, now_chats)
      prev_chat.extend(now_chats)
      new_commands = [chat for chat in now_chats if chat[2].split(' ')[0][0] == '!' and chat[2].split(' ')[0][1:] in command.keys()]
      for i in new_commands:
        try:
          client.emit('changeChar', data={ 'char' : i[2].split(' ')[1] }, namespace='/mapleinfo')
        except:
          pass
        time.sleep(1)          
    time.sleep(3)
  except:
    print('STOP')
    driver.quit()
    dbclient.close()
    client.disconnect()
    print(traceback.format_exc())
    break

