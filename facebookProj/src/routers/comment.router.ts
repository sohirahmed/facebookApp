import { Router } from "express";
import { commentsController } from "../controllers/comment.controller";
import { isAuthenticate } from "../middlewares/is-authenticate";

export const commentsRouter = Router();
commentsRouter.use(isAuthenticate);


commentsRouter.post("/", commentsController.create);
commentsRouter.get("/", commentsController.getAll);
commentsRouter.put("/:id", commentsController.update);
commentsRouter.delete("/:id", commentsController.deleteById);
