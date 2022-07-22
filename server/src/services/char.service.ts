import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const DBID = process.env.MONGODB_ID;
const DBPW = process.env.MONGODB_PW;

const URI = `mongodb+srv://${DBID}:${DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority`;
const client = new MongoClient(URI);

@Injectable()
export class CharService {
  async getChar(char: string) {
    let res: any;
    try {
      await client.connect();
      const db = client.db('MapleStat');
      const col = db.collection(char);
      res = await col.findOne(
        {},
        { sort: { date: -1 }, projection: { _id: 0 } },
      );
    } catch (err) {
      console.log(err);
    } finally {
      return res || 'ERROR';
    }
  }
  async getCharChange(char: string) {
    let res: any[] = [];
    try {
      await client.connect();
      const db = client.db('MapleStat');
      const col = db.collection(char);
      const cursor = col.find(
        {},
        { sort: { date: -1 }, projection: { _id: 0 }, limit: 2 },
      );
      await cursor.forEach((doc) => {
        res.push(doc);
      });
    } catch (err) {
      console.log(err);
    } finally {
      return res.length > 0 ? res : 'ERROR';
    }
  }
}
