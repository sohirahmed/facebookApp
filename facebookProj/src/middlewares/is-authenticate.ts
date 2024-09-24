import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { secretKey } from "../statics/statics";

export const isAuthenticate: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, secretKey);
      (req as any).userId = <string>decodedToken.sub;
      next();
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  } else {
    return res.status(403).json({ message: "Token not provided" });
  }
};
