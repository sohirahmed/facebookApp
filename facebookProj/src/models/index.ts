import { comments } from "./comment.model";
import { posts } from "./post.model";
import { reacts } from "./react.model";
import { users } from "./user.model";

export const db = {
  users,
  posts,
  reacts,
  comments,
};
