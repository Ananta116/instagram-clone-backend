import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";

export class UsersController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await prisma.users.create({
        data: { username, email, password },
      });
      res.status(200).send({
        message: "data added✅",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const filter: Prisma.UsersWhereInput = {};

      if (search) {
        filter.username = { contains: search as string };
      }
      const users = await prisma.users.findMany({
        where: filter,
        orderBy: { id: "asc" },
        // take: 2,
        // skip: 2,
      });

      const stats = await prisma.users.aggregate({
        // aggregate
        _count: { _all: true },
        _max: { createdAt: true },
        _min: { createdAt: true },
      });
      res.status(200).send({
        message: "users data ",
        data: users,
        stats,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.users.findUnique({ where: { id: +id } });
      res.status(200).send({
        message: "user detail",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: Prisma.UsersUpdateInput = req.body;
      await prisma.users.update({ where: { id: +id }, data });
      res.status(200).send({
        message: "user updated✅",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async delUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUserPosts(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.users.findUnique({
        where: { id: +id },
        include: { Posts : true },
      });

      res.status(200).send({
        message: "User's Posts",
        posts: user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
