import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const router = Router();

const vendaCarroSchema = z.object({
  compradorId: z.number(),
  carroId: z.number(),
  valor: z.number().min(1, { message: "O valor da venda deve ser maior que zero" })
});

// Configuração de e-mail (Mailtrap)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "09aa046895f6f9",
    pass: "af147d98d693fd",
  },
});

// Função auxiliar para enviar e-mail
async function enviaEmail(email: string, comprador: string, carro: string) {
  let mensagem = `
    <h2>Loja de Carros Multimarcas</h2>
    <p>Olá <strong>${comprador}</strong>,</p>
    <p>Obrigado por comprar seu veículo conosco!</p>
    <p>Parabéns pela aquisição do seu <strong>${carro}</strong> 🚗</p>
    <br/>
    <p>Atenciosamente,</p>
    <p><strong>Equipe Multimarcas</strong></p>
  `;

  const info = await transporter.sendMail({
    from: "Revenda Multimarcas <multimarcas@gmail.com>",
    to: email,
    subject: "Compra de Veículo - Multimarcas",
    html: mensagem
  });

  console.log("Email enviado com sucesso:", info.messageId);
  return info;
}

//  GET /vendaCarros  lista todas as vendas
router.get("/", async (req, res) => {
  try {
    const vendas = await prisma.vendaCarro.findMany({
      include: { comprador: true, carro: true }
    });
    res.status(200).json(vendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar vendas" });
  }
});

//  POST /vendaCarros  realiza a venda e marca o carro como vendido
router.post("/", async (req, res) => {
  const valida = vendaCarroSchema.safeParse(req.body);
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error });
  }

  const { compradorId, carroId, valor } = valida.data;

  try {
    // Busca comprador e carro
    const comprador = await prisma.comprador.findUnique({ where: { id: compradorId } });
    const carro = await prisma.carro.findUnique({ where: { id: carroId } });

    if (!comprador) return res.status(404).json({ erro: "Comprador não encontrado" });
    if (!carro) return res.status(404).json({ erro: "Carro não encontrado" });

    // Verifica estoque e status
    if (carro.vendido) {
      return res.status(400).json({ erro: "Este carro já foi vendido" });
    }
    if (carro.estoque <= 0) {
      return res.status(400).json({ erro: "Carro sem estoque disponível" });
    }

    // Transação: registra a venda e atualiza o carro
    const [venda, carroAtualizado] = await prisma.$transaction([
      prisma.vendaCarro.create({
        data: { compradorId, carroId, valor }
      }),
      prisma.carro.update({
        where: { id: carroId },
        data: { estoque: { decrement: 1 }, vendido: true }
      })
    ]);

    // Envia e-mail ao comprador
    try {
      await enviaEmail(comprador.email, comprador.nome, carro.modelo);
    } catch (erroEmail) {
      console.error("Erro ao enviar e-mail:", erroEmail);
      // Não cancela a venda, apenas loga o erro
    }

    res.status(201).json({
      mensagem: "Venda registrada com sucesso",
      venda,
      carroAtualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao registrar a venda" });
  }
});

// DELETE /vendaCarros/:id  exclui uma venda
router.delete("/:id", async (req, res) => { 
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Código inválido" });
  }

  try {
    await prisma.vendaCarro.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Venda não encontrada" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir a venda" });
  }
});

export default router;
