import { Router } from "express";
import { PrismaClient, Combustiveis } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// Schema para validação do body (POST e PUT)
const carroSchema = z.object({
  modelo: z.string().min(2, { message: "Modelo do carro deve ter no mínimo 2 caracteres" }),
  marca: z.string().min(3, { message: "Marca do carro deve ter no mínimo 3 caracteres" }),
  ano: z.number().min(1900, { message: "Ano do carro deve conter 4 dígitos e ser pelo menos 1900" }),
  combustivel: z.enum(Combustiveis, { message: "O tipo de combustível deve ser: GASOLINA, ALCOOL, FLEX, DIESEL ou ELETRICO" }),
  preco: z.number().min(1, { message: "Preço do carro deve ser maior que zero" }),
  estoque: z.number().default(1),
  vendido: z.boolean().default(false),
});

// Schema para validação dos filtros de query (GET)
const filtroSchema = z.object({
  marca: z.string().optional(),
  ano: z.preprocess(val => Number(val), z.number().int().min(1900).optional()),
  combustivel: z.enum(Combustiveis).optional(),
});

// ----------------- ROTAS -----------------

// ✅ GET /carro/disponiveis → retorna carros ainda disponíveis para venda
router.get("/disponiveis", async (req, res) => {
  try {
    const carrosDisponiveis = await prisma.carro.findMany({
      where: {
        vendido: false,
        estoque: { gt: 0 }
      },
    });

    if (carrosDisponiveis.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum carro disponível no momento" });
    }

    res.status(200).json(carrosDisponiveis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao buscar carros disponíveis" });
  }
});

// ✅ GET /carro - Lista todos os carros ou filtrados
router.get('/', async (req, res) => {
  try {
    const { marca, ano, combustivel } = req.query;

    const filtros: any = {};

    if (marca) {
      filtros.marca = { equals: String(marca) };
    }

    if (ano) {
      filtros.ano = { equals: Number(ano) };
    }

    if (combustivel) {
      filtros.combustivel = { equals: String(combustivel).toUpperCase() };
    }

    const carros = await prisma.carro.findMany({
      where: filtros
    });

    res.status(200).json(carros);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar carros' });
  }
});

// ✅ POST /carro - Adiciona um carro
router.post("/", async (req, res) => {
  const result = carroSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ erro: result.error.issues });
  }

  const { modelo, marca, ano, combustivel = "FLEX", preco, estoque = 1, vendido = false } = result.data;

  try {
    const carro = await prisma.carro.create({
      data: { modelo, marca, ano, combustivel, preco, estoque, vendido },
    });
    res.status(201).json(carro);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao cadastrar o carro" });
  }
});

// ✅ PUT /carro/:id - Atualiza um carro existente
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Código inválido" });
  }

  const result = carroSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ erro: result.error.issues });
  }

  const { modelo, marca, ano, combustivel, preco, estoque, vendido } = result.data;

  try {
    const carro = await prisma.carro.update({
      where: { id },
      data: { modelo, marca, ano, combustivel, preco, estoque, vendido },
    });
    res.status(200).json(carro);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Carro não cadastrado" });
    }
    console.log(error);
    res.status(500).json({ erro: "Erro ao atualizar carro" });
  }
});

// ✅ DELETE /carro/:id - Remove um carro
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "Código inválido" });
  }

  try {
    await prisma.carro.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Carro não cadastrado" });
    }
    console.log(error);
    res.status(500).json({ erro: "Erro ao excluir carro" });
  }
});

export default router;
