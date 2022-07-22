import { MongoClient } from "mongodb";

class MongoUtil {
  client: any

  constructor() {
    const DBID = process.env.MONGODB_ID;
    const DBPW = process.env.MONGODB_PW;
    
    const URI = `mongodb+srv://${DBID}:${DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority`;
    this.client = new MongoClient(URI);
  }

  async init() {
    await this.client.connect()
    console.log('DB Connected')
  }
}

export default new MongoUtil