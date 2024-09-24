import { ObjectId } from "mongodb";
import { database } from "../db/db";

export interface Post {
  _id: ObjectId;
  images: string[];
  date: Date;
  body: string;
  userId: ObjectId;
}

export const posts = database.collection<Post>("posts");
