import express, { Application } from "express";
import { UserRouter } from "./routers/user.router";
import { PostRouter } from "./routers/post.router";
import cors from "cors";
import { AuthRouter } from "./routers/auth.router";
import path from "path";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api/public", express.static(path.join(__dirname, "../public")));

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());
const postRouter = new PostRouter();
app.use("/api/posts", postRouter.getRouter());
const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
