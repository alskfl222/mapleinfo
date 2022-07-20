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
from pyvirtualdisplay import Display

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import undetected_chromedriver.v2 as uc
import chromedriver_autoinstaller


load_dotenv()
client = socketio.Client()


class MapleinfoNamespace(socketio.ClientNamespace):
    def connect(self):
        print("I'm connected!")

    def connect_error(self):
        print("The connection failed!")

    def disconnect(self):
        print("I'm disconnected!")


WS_SERVER = os.getenv('WS_SERVER')
client.register_namespace(MapleinfoNamespace('/mapleinfo'))
client.connect(WS_SERVER, namespaces=['/mapleinfo'])


@client.on('healthCheckRes', namespace='/mapleinfo')
def health_check(data):
  print(data)


client.emit('healthCheck', namespace='/mapleinfo')


display = Display(visible=False, backend="xvfb")
display.start()


print(chromedriver_autoinstaller.install())
options = uc.ChromeOptions()
# options.add_argument("headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--single-process")
options.add_argument("--disable-dev-shm-usage")
driver = uc.Chrome(options=options)
driver.set_window_size(1280, 1024)


ENV = os.getenv("ENV")
DBID = os.getenv("MONGODB_ID")
DBPW = os.getenv("MONGODB_PW")
atlas_link = f"mongodb+srv://{DBID}:{DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority"
dbclient = pymongo.MongoClient(atlas_link, tlsCAFile=certifi.where())


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
    display.stop()
    dbclient.close()
    client.disconnect()
    print(traceback.format_exc())
    break

