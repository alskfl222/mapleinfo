#!/usr/bin/env python
# coding: utf-8

import os
import traceback
from pathlib import Path
import re
import datetime
from pytz import timezone, utc
import requests
import urllib
import pymongo
import certifi
from dotenv import load_dotenv
from bs4 import BeautifulSoup


load_dotenv()
ENV = os.getenv("ENV")
DBID = os.getenv("MONGODB_ID")
DBPW = os.getenv("MONGODB_PW")
atlas_link = f"mongodb+srv://{DBID}:{DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority"


def get_kst_now():
  now = utc.localize(datetime.datetime.utcnow())
  kst_now = now.astimezone(timezone('Asia/Seoul'))
  return kst_now

def get_kst_today():
  now = utc.localize(datetime.datetime.utcnow())
  kst_now = now.astimezone(timezone('Asia/Seoul'))
  kst_today = datetime.datetime(kst_now.year, kst_now.month, kst_now.day)
  return kst_today


today_date = get_kst_today()


current_path = Path.cwd() if ENV == "local" else Path.home() / "mapleinfo" / "crawler"
data_dir = current_path.parent / "data"
data_dir.mkdir(exist_ok=True)
year_dir = data_dir / f"{today_date.strftime('%Y')}"
year_dir.mkdir(exist_ok=True)
month_dir = year_dir / f"{today_date.strftime('%m')}"
month_dir.mkdir(exist_ok=True)
img_dir = month_dir / "image"
img_dir.mkdir(exist_ok=True)


chars_path = current_path / 'chars.csv'
with open(f"{str(chars_path)}", encoding='utf-8') as f:
  chars = f.readline().split(',')


dbclient = pymongo.MongoClient(atlas_link, tlsCAFile=certifi.where())
db = dbclient["MapleStat"]
col_log = db.log
date_log = col_log.find_one({"status": "COMPLETE"}, {"_id": 0, 'date': 1}, sort=[("date", pymongo.DESCENDING)])
last_date = date_log["date"] if date_log else datetime.datetime(2000, 1, 1)


base_url = "https://maplestory.nexon.com"
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
headers = {"User-Agent": user_agent}
opener = urllib.request.build_opener()
opener.addheaders = [("User-Agent", user_agent)]
urllib.request.install_opener(opener)


def export_db(char_info):
  col = db[char_info['name']]
  row = char_info
  row["date"] = today_date
  col.insert_one(row)


def get_char_stat(char):
  print(f"MAPLEINFO : GET CHARACTOR STAT - {char} START")

  col = db[char]
  last_date_char_stat = col.find_one({}, {"_id": 0, 'date': 1}, sort=[("date", pymongo.DESCENDING)])
  if today_date == last_date_char_stat:
    print(f"MAPLEINFO : GET CHARACTOR STAT - {char} ALREADY EXIST")
    print(f"{'='*50}")
    return char

  char_rank_page_res = requests.get(f"{base_url}/Ranking/World/Total?c={char}", headers=headers)
  char_rank_page_soup = BeautifulSoup(char_rank_page_res.text, 'lxml')
  char_link = base_url + char_rank_page_soup.select_one('.search_com_chk a')['href']
  print('RANK PAGE')

  try:
    char_stat_page_res = requests.get(char_link, headers=headers)
    char_stat_page_soup = BeautifulSoup(char_stat_page_res.text, "lxml")
    print('CHARACTOR PAGE')
  except:
    print(f"MAPLEINFO : GET CHARACTOR STAT - {char} ERROR (CHECK CHARACTOR STAT OPEN)")

  level = char_stat_page_soup.select_one(".char_info > dl:nth-child(1) > dd").text.split(".")[1]
  class_type = char_stat_page_soup.select_one(".char_info > dl:nth-child(2) > dd").text.split("/")[1]
  exp = "".join(re.findall("\d+", char_stat_page_soup.select_one(".char_info > div.level_data > span:nth-child(1)").text))
  img = char_stat_page_soup.select_one(".char_img > div > img")["src"]
  img_path = img_dir / f"{today_date.strftime('%Y-%m-%d')}_{char}.png"
  if not os.path.isfile(str(img_path)):
    urllib.request.urlretrieve(img, str(img_path))
    print(f'GET {char} IMAGE')

  char_info = {"name":char, "level":level, "class_type":class_type, "exp":exp}
  stat_table = char_stat_page_soup.find_all(class_="table_style01")[1]
  char_info_name = ["stat_att", "hp", "mp", "str", "dex", "int", "luk", \
    "critical_dmg", "boss_att", "ignore_def", "status_resistance", "knockback_resistance", \
    "def", "speed", "jump", "star_force", "honor_exp", "arcane_power"]
  char_info_att = stat_table.find_all("td")
  for i in range(0, len(char_info_att)-2):
    char_info[char_info_name[i]] = char_info_att[i].text.replace(",","").replace("%","").strip()
  ability = char_info_att[-2].select_one("span").prettify().split("\n")
  ability_count = 1
  for i in range(len(ability)):
    if ability[i].strip()[0] == "<":
      continue
    char_info[f"ability_{ability_count}"] = ability[i].strip()
    ability_count += 1
  hyperstat = char_info_att[-1].select_one("span").prettify().split("\n")
  hyperstat_count = 1
  for i in range(len(hyperstat)):
    if hyperstat[i].strip()[0] == "<":
      continue
    char_info[f"hyper_stat_{hyperstat_count}"] = hyperstat[i].strip()
    hyperstat_count += 1
  export_db(char_info)
  print(f"MAPLEINFO : GET CHARACTOR STAT - {char} DONE")
  print(f"{'='*50}")
  


def log_db(status, *args):
  log = {"date": today_date, "chars": chars, "status": status, 'time': get_kst_now()}
  if status == 'FAIL':
    log['error_log'] = traceback.format_exc()
  if status == 'PARTIAL':
    log['error_chars'] = args[0]
  col_log.insert_one(log)
  print(f"MAPLEINFO : {status} - {today_date.strftime('%Y-%m-%d')}")
  print()
  print(f"{'='*50}")
  print()


def main():
  if last_date != today_date:
    print(f"MAPLEINFO : UPDATE START - {today_date.strftime('%Y-%m-%d')}")
    error_chars = []
    try:
      for char in chars:
        error_char = get_char_stat(char)
        if error_char:
          error_chars.append(error_char)
      if not error_chars:
        log_db('COMPLETE')
      else:
        log_db('PARTIAL', error_chars)
    except:
      log_db('FAIL')
  else:
    log_db('ALREADY UPDATED')


if __name__ == '__main__':
  main()

