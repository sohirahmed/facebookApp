import { ObjectId } from "mongodb";

export interface CreateReactRequest {
    postId: ObjectId; 
    userId :ObjectId
    type: string;   
  }
  