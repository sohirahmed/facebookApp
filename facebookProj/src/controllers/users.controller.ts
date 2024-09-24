import jwt from "jsonwebtoken";
import { RequestHandler, Request, Response } from "express";
import {
  RegisterRequest,
  RegisterResponse,
} from "../requests/users/register.request";
import { db } from "../models";
import { ObjectId } from "mongodb";
import { ImageHelper } from "../helpers/image.helper";
import { User } from "../models/user.model";
import { LoginRequest } from "../requests/users/login.request";
import { secretKey } from "../statics/statics";

//=================================**register**=========================================



const register: RequestHandler = async (
  req: Request<{}, RegisterResponse, RegisterRequest>,
  res: Response
) => {
  const user = await db.users.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser: User = {
    _id: new ObjectId(),
    email: req.body.email,
    name: req.body.name,
    job: req.body.job,
    password: req.body.password,
  };

  if (req.file) {
    const fileName = `${newUser._id}-${req.file.originalname}`;
    await ImageHelper.saveImageAsync(fileName, req.file.buffer);
    newUser.image = fileName;
  } else {
    newUser.image = "default-image.jpg";
  }

  db.users.insertOne(newUser);

  res.json(newUser);
};


//==============================**login**==============================



const login: RequestHandler = async (
  req: Request<{}, {}, LoginRequest>,
  res
) => {

console.log(req.body);

  const user = await db.users.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  console.log(user);
  
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  
  const token = jwt.sign(
    {
      email: user.email,
    },
    secretKey,
    {
      subject: user._id.toString(),
      expiresIn: "1d",
      issuer: req.headers.host,
    }
  );
  res.json({ token });
};

export const usersController = {
  register,
  login,
};
