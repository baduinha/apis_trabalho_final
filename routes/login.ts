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
    // Guarda a última data de login ANTES de atualizar
    const ultimoAcessoAnterior = usuario.ultimoLogin;

    // Atualiza o campo de último login
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() }
    });

    // Gera token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      SECRET,
      { expiresIn: "1d" }
    );

    // Resposta diferenciada
    let mensagemAcesso = "";

    if (!ultimoAcessoAnterior) {
      mensagemAcesso = "Este é o seu primeiro acesso ao sistema.";
    } else {
      mensagemAcesso = `Seu último acesso foi em: ${ultimoAcessoAnterior.toLocaleString("pt-BR")}`;
    }

    // REGISTRA LOG DE LOGIN
    await registrarLog(usuario.id, "Login realizado");

    return res.json({
       mensagem: `Bem Vindo, ${usuario.nome}!`,
       info: mensagemAcesso,
       token
      
      });
  } catch (erro: any) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;
