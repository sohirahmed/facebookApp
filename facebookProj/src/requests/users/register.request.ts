import { ObjectId } from "mongodb";

export interface RegisterRequest {
  name: string;
  job: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  _id: ObjectId;
}
