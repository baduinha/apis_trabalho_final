import { Router } from "express";
import { criarUsuario, listarUsuarios } from "./usuariosController";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);

export default router;
