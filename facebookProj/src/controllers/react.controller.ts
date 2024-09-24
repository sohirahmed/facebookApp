import { reacts } from './../models/react.model';
import { Request, Response } from "express";
import { db } from "../models";
import { ReactType } from "../models/react.type"; 
import { ObjectId } from "mongodb";
import { CreateReactRequest } from "../requests/react/create-react.request";
import { UpdateReactRequest } from '../requests/react/update-react.request';



export const reactsController = {
//======================================**Create**=======================================
create: async (req: Request<{}, {}, CreateReactRequest>, res: Response) => {
    const { postId, type } = req.body; 
    const userId = (req as any).userId; 

    if (!["like", "love", "funny", "sad", "angry"].includes(type)) {
        return res.status(400).json({ message: "Invalid react type" });
    }

    const react = {
        postId: new ObjectId(postId), 
        userId: new ObjectId(userId), 
        type: type as ReactType,  
    };

    try {
        await db.reacts.insertOne(react);
        return res.status(201).json(react);
    } catch (error) {
        return res.status(500).json({ message: "Error creating react", error });
    }
},


//===================================**GET**=======================================    
    getAll: async (req: Request, res: Response) => {
        const reacts = await db.reacts
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
        return res.status(200).json(reacts);
    },


    update: async (req: Request<{ id: string }, {}, UpdateReactRequest>, res: Response) => {
        const { id } = req.params;
        const { type } = req.body;

        if (!["like", "love", "funny", "sad", "angry"].includes(type)) {
            return res.status(400).json({ message: "Invalid react type" });
        }
        try {
            const result = await reacts.updateOne(
                { _id: new ObjectId(id) },
                { $set: { type } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "React not found" });
            }

            return res.status(200).json({ message: "React updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error updating react", error });
        }
    },

//=======================================**Delete**=======================================
    delete: async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;

        try {
            const result = await db.reacts.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "React not found" });
            }

            return res.status(200).json({ message: "React deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting react", error });
        }
    },
};
