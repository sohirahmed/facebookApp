import { Request } from "express";
import jwt from "jsonwebtoken";

export class JwtHelper {
  static getUserId(req: Request) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    const decodedToken = jwt.decode(token, { json: true });

    return decodedToken?.sub;
  }
}
