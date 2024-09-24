import { ObjectId } from "mongodb";
import { database } from "../db/db";
import { ReactType } from "./react.type";

export interface React {
  postId: ObjectId;
  userId: ObjectId;
  type: ReactType;
}

export const reacts = database.collection<React>("reacts");
