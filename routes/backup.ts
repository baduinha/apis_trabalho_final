import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /backup
router.get("/", async (req, res) => {
  try {
    const backup = {
      usuarios: await prisma.usuario.findMany(),
      carros: await prisma.carro.findMany(),
      compradores: await prisma.comprador.findMany(),
      vendas: await prisma.vendaCarro.findMany(),
      logs: await prisma.log.findMany()
    };

    return res.json(backup);
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
});

// POST /restore
router.post("/", async (req, res) => {
  const { usuarios, carros, compradores, vendas, logs } = req.body;

  try {
    // Limpa tudo
    await prisma.log.deleteMany();
    await prisma.vendaCarro.deleteMany();
    await prisma.carro.deleteMany();
    await prisma.comprador.deleteMany();
    await prisma.usuario.deleteMany();

    // Restaura dados
    if (usuarios) await prisma.usuario.createMany({ data: usuarios });
    if (carros) await prisma.carro.createMany({ data: carros });
    if (compradores) await prisma.comprador.createMany({ data: compradores });
    if (vendas) await prisma.vendaCarro.createMany({ data: vendas });
    if (logs) await prisma.log.createMany({ data: logs });

    return res.json({ mensagem: "Backup restaurado com sucesso!" });
  } catch (err: any) {
    return res.status(500).json({ erro: err.message });
  }
});

export default router;
