import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

export class PostController {
  async getPost(req: Request, res: Response) {
    try {
      const posts = await prisma.posts.findMany({
        // untuk mengambil semua data tanpa terkecuali
        // include : {user: true}
        // untuk mengambil beberapa data
        select: {
          id: true,
          imageUrl: true,
          caption: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              Likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const userLike = await prisma.likes.findMany({
        where: { userId: req.user?.id },
      });

      const likedPost = new Set(userLike.map((item) => item.postId));

      const result = posts.map((post) => {
        return {
          ...post,
          liked: likedPost.has(post.id),
          likeCount: post._count.Likes,
        };
      });
      res.status(200).send({
        message: "Data Post",
        posts: result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image Empty" };
      const { caption } = req.body;
      const imageUrl = `http://localhost:8000/api/public/${req.file.filename}`;

      await prisma.posts.create({
        data: { imageUrl, caption, usersId: req.user?.id! },
      });
      res.status(201).send({
        message: "Post Created!",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { imageUrl, caption } = req.body;

      const updatedPost = await prisma.posts.update({
        where: { id: +id },
        data: {
          imageUrl,
          caption,
        },
      });

      res.status(200).send({
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async delPost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.posts.delete({
        where: { id: +id },
      });

      res.status(200).send({
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createPostCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "image empty" };
      const { caption } = req.body;
      const { secure_url } = await cloudinaryUpload(req.file, "ig");

      await prisma.posts.create({
        data: { imageUrl: secure_url, caption, usersId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post Created",
        secure_url,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async likeUnlike(req: Request, res: Response) {
    try {
      const { postId } = req.body;

      const isLike = await prisma.likes.findUnique({
        where: {
          userId_postId: {
            postId,
            userId: req.user?.id!,
          },
        },
      });

      if (isLike) {
        //unlike
        await prisma.likes.delete({
          where: {
            userId_postId: {
              postId,
              userId: req.user?.id!,
            },
          },
        });
        res.status(200).send({ liked: false });
      } else {
        //like
        await prisma.likes.create({
          data: {
            postId,
            userId: req.user?.id!,
          },
        });
        res.status(200).send({ liked: true });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
