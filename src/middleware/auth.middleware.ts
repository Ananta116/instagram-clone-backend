import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../../custom";

export class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw { message: "Unauthorize!" };

      const verifiedUser = verify(token, process.env.KEY_JWT!);
      req.user = verifiedUser as UserPayload;
      next();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== "admin") throw { message: "Admin Only" };
      next();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
