import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const DBID = process.env.MONGODB_ID;
const DBPW = process.env.MONGODB_PW;

const URI = `mongodb+srv://${DBID}:${DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority`;
const client = new MongoClient(URI);

@Injectable()
export class CharService {
  async getChar(char: string): Promise<any> {
    try {
      await client.connect();
      const db = client.db('MapleStat');
      const col = db.collection(char);
      const result = await col.findOne(
        {},
        { sort: { date: -1 }, projection: { _id: 0 } },
      );
      await client.close();
      return result;
    } catch (err) {
      await client.close();
      console.log(err);
      return 'ERROR';
    }
  }
  async getCharChange(char: string): Promise<any> {
    try {
      await client.connect();
      const db = client.db('MapleStat');
      const col = db.collection(char);
      const cursor = col.find(
        {},
        { sort: { date: -1 }, projection: { _id: 0 }, limit: 2 },
      );
      const result = [];
      await cursor.forEach((doc) => {
        result.push(doc);
      });
      await client.close();
      return result;
    } catch (err) {
      await client.close();
      console.log(err);
      return 'ERROR';
    }
  }
}
