import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { PostController } from "../controllers/post.controller";

export class UserRouter {
  private router: Router;
  private usersController: UsersController;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.initializeRouter();
  }
  private initializeRouter() {
    this.router.post("/", this.usersController.createUser);
    this.router.get("/", this.usersController.getUsers);
    this.router.get("/:id", this.usersController.getUserId);
    this.router.patch("/:id", this.usersController.updateUser);
    this.router.get("/:id/posts", this.usersController.getUserPosts);
  }
  getRouter(): Router {
    return this.router;
  }
}
