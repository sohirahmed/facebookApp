import { ObjectId } from "mongodb";
import { database } from "../db/db";

export interface Comment {
  image?: string;
  body: string;
  date: Date;
  userId: ObjectId;
  postId: ObjectId;
}

export const comments = database.collection<Comment>("comments");
