import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registrarLog } from "./logService.js";

const router = Router();
const prisma = new PrismaClient();
const SECRET = "CHAVE_SUPER_SECRETA";

// POST /login
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      SECRET,
      { expiresIn: "1d" }
    );

    // REGISTRA LOG DE LOGIN
    await registrarLog(usuario.id, "Login realizado");

    return res.json({ token });
  } catch (erro: any) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
