import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { uploader } from "../helpers/uploader";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PostRouter {
  private router: Router;
  private postController: PostController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }
  private initializeRoute() {
    this.router.post(
      "/like",
      this.authMiddleware.verifyToken,
      this.postController.likeUnlike
    );
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.postController.getPost
    );
    this.router.post(
      "/",
      uploader("diskStorage", "ig-").single("image"),
      this.authMiddleware.verifyToken,
      this.postController.createPost
    );
    this.router.post(
      "/cloud",
      uploader("memoryStorage", "ig-").single("image"),
      this.authMiddleware.verifyToken,
      this.postController.createPostCloud
    );
    this.router.patch("/:id", this.postController.updatePost);
    this.router.delete("/:id", this.postController.delPost);
  }

  getRouter(): Router {
    return this.router;
  }
}
