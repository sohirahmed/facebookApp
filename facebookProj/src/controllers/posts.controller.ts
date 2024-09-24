import { RequestHandler, Request, Response } from "express";
import { CreatePostRequest } from "../requests/posts/create-post.request";
import { ObjectId } from "mongodb";
import { ImageHelper } from "../helpers/image.helper";
import { JwtHelper } from "../helpers/JwtHelper";
import { db } from "../models";
import { Post, posts } from "../models/post.model";
import { UpdatePostRequest } from "../requests/posts/update-post.request";


//==================================**createPost**====================================
const create: RequestHandler = async (
  req: Request<{}, {}, CreatePostRequest>,
  res: Response
) => {
  const userId = <string>(req as any).userId;
  let post: Post = {
    _id: new ObjectId(),
    date: new Date(),
    body: req.body.body,
    userId: new ObjectId(userId), 
    images: [],
  };
  if (req.files && Array.isArray(req.files)) {
    for await (const file of req.files) {
      const fileName = `${post._id}-${file.originalname}`;
      await ImageHelper.saveImageAsync(fileName, file.buffer);
      console.log(fileName);

      post.images.push(fileName);
    }
  }
  await db.posts.insertOne(post);
  return res.status(200).json(post);
};

//=======================================**GetAll**================================
const getAll: RequestHandler = async (req: Request, res: Response) => {
  const posts = await db.posts
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $project: { images: 1, body: 1, date: 1, user: { job: 1, name: 1 } } },
    ])
    .toArray();
  return res.status(200).json(posts);
};

//==================================**updatePost**====================================
const updatePost: RequestHandler<{ id: string }, {}, UpdatePostRequest> = async (req, res) => {
  const { id } = req.params; 
  const { body, images } = req.body; 

  try {
      const result = await posts.updateOne(
          { _id: new ObjectId(id) },
          { $set: { body, images } } 
      );

      if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error updating post", error });
  }
}
//==================================**deletePost**====================================
const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const post = await db.posts.findOne({ _id: new ObjectId(id) });
  if (post) {
    await db.posts.deleteOne({ _id: new ObjectId(id) });
    
    post.images.forEach(async (image) => {
      await ImageHelper.deleteImage(image);
    });
    return res.status(200).json({ message: "Post deleted successfully" });
  }
  return res.status(404).json({ message: "Post not found" });
};

export const postsController = {
  create,
  getAll,
  updatePost,
  deleteById,

  
};
