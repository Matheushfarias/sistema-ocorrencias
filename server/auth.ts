import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "bo-militar-secret-key-2024";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  type: "cidadao" | "atendente";
  instituicao?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    type: user.type,
    instituicao: user.instituicao,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token de autenticação não fornecido" });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }

  req.user = payload;
  next();
}

export function requireCidadao(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.type !== "cidadao") {
    return res.status(403).json({ message: "Acesso permitido apenas para cidadãos" });
  }
  next();
}

export function requireAtendente(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.type !== "atendente") {
    return res.status(403).json({ message: "Acesso permitido apenas para atendentes" });
  }
  next();
}
