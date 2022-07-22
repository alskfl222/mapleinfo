import { Injectable } from '@nestjs/common';
import MongoUtil from './db.service';

@Injectable()
export class CharService {
  async getChar(char: string) {
    let res: any;
    try {
      const db = MongoUtil.client.db('MapleStat');
      const col = db.collection(char);
      res = await col.findOne(
        {},
        { sort: { date: -1 }, projection: { _id: 0 } },
      );
      return res;
    } catch (err) {
      console.log(err);
      return 'getChar ERROR';
    }
  }
  async getCharChange(char: string) {
    try {
      const res = [];
      const db = MongoUtil.client.db('MapleStat');
      const col = db.collection(char);
      const cursor = col.find(
        {},
        { sort: { date: -1 }, projection: { _id: 0 }, limit: 2 },
      );
      await cursor.forEach((doc: any) => {
        res.push(doc);
      });
      return res;
    } catch (err) {
      console.log(err);
      return 'getCharChange ERROR';
    }
  }
}
