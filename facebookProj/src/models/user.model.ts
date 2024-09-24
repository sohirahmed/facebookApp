import { ObjectId } from "mongodb";
import { database } from "../db/db";

export interface User {
  _id: ObjectId;
  name: string;
  job: string;
  image?: string;
  email: string;
  password: string;
}

export const users = database.collection<User>("users");
