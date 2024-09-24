import express, { json, NextFunction, Request, Response } from "express";
import { userRouter } from "./src/routers/user.router";
import path from "path";
import { postsRouter } from "./src/routers/posts.router";
import cors from "cors";
import { commentsRouter } from "./src/routers/comment.router";
import { reactsRouter } from "./src/routers/react.router";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(cors()); 

app.use(json()); 



app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/reacts", reactsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: error.message });
});

app.listen(4000, () => {
  console.log("Server is running on port http://localhost:4000");
});


