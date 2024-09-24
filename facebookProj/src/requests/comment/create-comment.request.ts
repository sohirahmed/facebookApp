import { ObjectId } from "mongodb";

export interface CreateCommentRequest {
    body: string;
    postId: ObjectId;
}