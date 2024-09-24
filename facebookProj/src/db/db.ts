import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017"; //mongodb://127.0.0.1:27017
const dbName = "facebookProject";

const client = new MongoClient(url);
export const database = client.db(dbName);
