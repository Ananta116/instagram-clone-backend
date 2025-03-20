import { Request, Response } from "express";
import prisma from "../prisma";

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
              email: true,
            },
          },
        },
      });
      res.status(200).send({
        message: "Data Post",
        posts,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  

  async createPost(req: Request, res: Response) {
    try {
        const { imageUrl, caption, userId } = req.body;

        const newPost = await prisma.posts.create({
            data: {
                imageUrl,
                caption,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        res.status(201).send({
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updatePost(req: Request, res:Response){
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
        console.log(error)
        res.status(400).send(error)
    }
  }

  async delPost(req: Request, res:Response){
    try {
        const { id } = req.params;

        await prisma.posts.delete({
            where: { id: +id },
        });

        res.status(200).send({
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
  }
}
