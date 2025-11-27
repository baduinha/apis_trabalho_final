import express from 'express'
const app = express()
const port = 3000

import carrosRoutes from "./routes/carro.ts"
import compradorRoutes from "./routes/comprador.ts"
import vendaCarrosRoutes from "./routes/vendaCarros.ts"
import usuarioRoutes from "./routes/usuarioRoutes.ts"
import { criarUsuario, listarUsuarios } from "./routes/usuariosController";


app.use(express.json())  // middleware para aceitar dados no formato JSON

app.use("/carro", carrosRoutes)
app.use("/comprador", compradorRoutes)
app.use("/vendaCarros", vendaCarrosRoutes)
app.use("/usuario", usuarioRoutes)

app.get('/', (req, res) => {
  res.send('API: Loja de Carros')

})


app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port} graças a deus !`)
})
