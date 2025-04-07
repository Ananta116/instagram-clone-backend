import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { PostController } from "../controllers/post.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class UserRouter {
  private router: Router;
  private usersController: UsersController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRouter();
  }
  private initializeRouter() {
    this.router.post("/",  this.usersController.createUser);
    this.router.get("/", this.authMiddleware.verifyToken, this.usersController.getUsers);
    this.router.get("/posts", this.authMiddleware.verifyToken, this.usersController.getUserPosts);
    this.router.get("/:id", this.usersController.getUserId);
    this.router.patch("/edit", this.authMiddleware.verifyToken, this.usersController.updateUser);
  }
  getRouter(): Router {
    return this.router;
  }
}
