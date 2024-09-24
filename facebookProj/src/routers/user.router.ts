import { Router } from "express";
import multer from "multer";
import { usersController } from "../controllers/users.controller";

export const userRouter = Router();

userRouter.post(
  "/register",
  multer().single("image"),
  usersController.register
);

userRouter.post("/login", usersController.login);
