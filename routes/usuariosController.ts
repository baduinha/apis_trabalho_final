import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

// Regex senha forte
const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export async function criarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;

    if (!senhaForte.test(senha)) {
      return res.status(400).json({
        erro:
          "A senha deve ter no mínimo 8 caracteres, incluindo minúsculas, maiúsculas, números e símbolos.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
      },
    });

    return res.status(201).json(usuario);
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
}

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    return res.json(usuarios);
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
}
