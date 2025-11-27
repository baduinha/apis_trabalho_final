import { Router } from "express";
import { criarUsuario, listarUsuarios } from "./usuariosController.js";
import { autenticaMiddleware } from "./autenticaMiddleware.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios, autenticaMiddleware);

export default router;
