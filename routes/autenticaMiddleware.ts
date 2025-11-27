import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const SECRET = "CHAVE_SUPER_SECRETA";

export function autenticaMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const usuario = jwt.verify(token, SECRET);

    // @ts-ignore
    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(403).json({ erro: "Token inválido" });
  }
}
