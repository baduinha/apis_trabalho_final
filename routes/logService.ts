import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registrarLog(usuarioId: number, acao: string) {
  try {
    await prisma.log.create({
      data: {
        usuarioId,
        acao
      }
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
}
