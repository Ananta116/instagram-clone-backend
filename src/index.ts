import express, { Application } from "express";
import { UserRouter } from "./routers/user.router";
import { PostRouter } from "./routers/post.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());
const postRouter = new PostRouter();
app.use("/api/posts", postRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
