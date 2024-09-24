import { Router } from "express";
import multer from "multer";
import { isAuthenticate } from "../middlewares/is-authenticate";
import { postsController } from "../controllers/posts.controller";

export const postsRouter = Router();

postsRouter.use(isAuthenticate);

postsRouter
  .route("/")
  .post(multer().array("images"), postsController.create)
  .get(postsController.getAll);

postsRouter.put("/:id", postsController.updatePost);  
postsRouter.delete("/:id", postsController.deleteById);
