import prisma from "../prisma";
import { Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password, fullname } = req.body;
      // untuk encrypsi password untuk password user =>
      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      const user = await prisma.users.create({
        data: { username, email, password: hashedPass, fullname },
      });
      res.status(200).send({
        message: "user registered✅",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) throw { message: "User not found" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Incorrect password" };

      const payload = { id: user.id, role: "user" };
      const access_token = sign(payload, process.env.KEY_JWT!, { expiresIn: "10m" });

      res.status(200).send({
        message: "Login success",
        data: user,
        access_token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
