import prisma from "../prisma";
import { Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "../helpers/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

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

      const payload = { id: user.id, role: "user" };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: "10m" });
      const link = `${process.env.URL_FE}/verify/${token}`;
      // link : http://localhost:3000 (nanti ganti pake link deployment + /verify + /token

      const templatePath = path.join(__dirname, "../templates", `verify.hbs`);
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username,link });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "verification Email",
        html,
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
      if (!user.isVerify)
        throw {
          message: "Account Not Verified",
        };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Incorrect password" };

      const payload = { id: user.id, role: "user" };
      const access_token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1h",
      });

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
  async verify(req: Request, res: Response) {
    try {
      await prisma.users.update({
        data: { isVerify: true },
        where: { id: req.user?.id },
      });

      res.status(200).send({ message: "verification success!" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
