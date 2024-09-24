import { Router } from "express";
import { reactsController } from "../controllers/react.controller";
import { isAuthenticate } from "../middlewares/is-authenticate";

export const reactsRouter = Router();
reactsRouter.use(isAuthenticate);

reactsRouter.post("/", reactsController.create);
reactsRouter.get("/", reactsController.getAll);
reactsRouter.put("/:id", reactsController.update);
reactsRouter.delete("/:id", reactsController.delete);
