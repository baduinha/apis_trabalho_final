import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import nodemailer from "nodemailer";

const router = Router();
const prisma = new PrismaClient();

// Schema para validação
const compradorSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  cnh: z.string().min(11, { message: "CNH deve ter no mínimo 11 caracteres" }),
  telefone: z.string().min(10, { message: "Telefone deve ter no mínimo 10 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  endereco: z.string().min(5, { message: "Endereço deve ter no mínimo 5 caracteres" }),
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "09aa046895f6f9",
    pass: "af147d98d693fd", // substitua pela senha real
  },
});

// ---------------- ROTAS ----------------

// GET /comprador - lista todos os compradores
router.get("/", async (req, res) => {
  try {
    const compradores = await prisma.comprador.findMany();
    res.status(200).json(compradores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// GET /comprador/:id - busca um comprador pelo ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "Código inválido" });

  try {
    const comprador = await prisma.comprador.findUnique({ where: { id } });
    if (!comprador) return res.status(404).json({ erro: "Comprador não encontrado" });
    res.status(200).json(comprador);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// POST /comprador - cria um novo comprador
router.post("/", async (req, res) => {
  const valida = compradorSchema.safeParse(req.body);
  if (!valida.success) return res.status(400).json({ erro: valida.error.issues });

  const { nome, cnh, telefone, email, endereco } = valida.data;

  try {
    const comprador = await prisma.comprador.create({ data: { nome, cnh, telefone, email, endereco } });

    // Envia e-mail de boas-vindas (opcional, não trava a criação)
    try {
      await transporter.sendMail({
        from: "Revenda Multima Marcas <multimarcas@gmail.com>",
        to: email,
        subject: "Bem-vindo à Multimarcas!",
        html: `<h2>Olá ${nome}</h2><p>Bem-vindo à nossa loja de carros!</p>`
      });
    } catch (err) {
      console.log("Erro ao enviar email:", err);
    }

    res.status(201).json(comprador);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao cadastrar o comprador" });
  }
});

// PUT /comprador/:id - atualiza um comprador
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "Código inválido" });

  const valida = compradorSchema.safeParse(req.body);
  if (!valida.success) return res.status(400).json({ erro: valida.error.issues });

  const { nome, cnh, telefone, email, endereco } = valida.data;

  try {
    const comprador = await prisma.comprador.update({
      where: { id },
      data: { nome, cnh, telefone, email, endereco }
    });
    res.status(200).json(comprador);
  } catch (error: any) {
    if (error.code === "P2025") return res.status(404).json({ erro: "Comprador não cadastrado" });
    console.log(error);
    res.status(500).json({ erro: "Erro ao atualizar comprador" });
  }
});

// DELETE /comprador/:id - remove um comprador
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "Código inválido" });

  try {
    // Verifica se existem vendas associadas
    const vendaExistente = await prisma.vendaCarro.findFirst({ where: { compradorId: id } });
    if (vendaExistente) return res.status(400).json({ erro: "Comprador possui vendas e não pode ser deletado" });

    await prisma.comprador.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") return res.status(404).json({ erro: "Comprador não cadastrado" });
    console.log(error);
    res.status(500).json({ erro: "Erro ao excluir comprador" });
  }
});

export default router;
