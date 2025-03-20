import { Router } from "express";
import { PostController } from "../controllers/post.controller";

export class PostRouter {
  private router: Router;
  private postController: PostController;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.initializeRoute();
  }
  private initializeRoute() {
    this.router.get("/", this.postController.getPost);
    this.router.post("/", this.postController.createPost);
    this.router.patch("/:id", this.postController.updatePost);
    this.router.delete("/:id", this.postController.delPost);
  }

  getRouter(): Router {
    return this.router;
  }
}
