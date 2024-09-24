import { Request, Response } from "express";
import { db } from "../models";
import { Comment, comments } from "../models/comment.model";
import { CreateCommentRequest } from "../requests/comment/create-comment.request";
import { ObjectId } from "mongodb"; 
import { UpdateCommentRequest } from "../requests/comment/update-comment.request";

export const commentsController = {

//============================**createComment**======================================   
    create: async (req: Request<{}, {}, CreateCommentRequest>, res: Response) => {
        const userId = <string>(req as any).userId;
        const newComment: Comment = {
            body: req.body.body,
            date: new Date(),
            userId: new ObjectId(userId), 
            postId: new ObjectId(req.body.postId), 
        };

        try {
            await db.comments.insertOne(newComment);
            return res.status(201).json(newComment);
        } catch (error) {
            return res.status(500).json({ message: "Error creating comment", error });
        }
    },


//===========================**GetAll**===========================
    getAll: async (req: Request, res: Response) => {
        const comments = await db.comments
            .aggregate([
                {
                    $lookup: {
                        from: "posts", 
                        localField: "postId",
                        foreignField: "_id",
                        as: "postDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users", 
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: { path: "$postDetails", preserveNullAndEmptyArrays: true }
                },
                {
                    $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
                }
            ]).toArray();
        return res.status(200).json(comments);
    },

//==============================**Update**=====================================
    update: async (req: Request<{ id: string }, {}, UpdateCommentRequest>, res: Response) => {
        const { id } = req.params; 
        const { body } = req.body; 

        try {
            const result = await comments.updateOne(
                { _id: new ObjectId(id) },
                { $set: { body } } 
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json({ message: "Comment updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error updating comment", error });
        }
    },

//===========================**Delete**===========================    
    deleteById: async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const result = await db.comments.deleteOne({ _id: new ObjectId(id) }); 

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    },

    }