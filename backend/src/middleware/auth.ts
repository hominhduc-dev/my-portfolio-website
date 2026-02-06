import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "dev-secret";

interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = (req as any).cookies?.access_token as string | undefined;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
