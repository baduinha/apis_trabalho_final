import express from 'express'
const app = express()
const port = 3000

import carrosRoutes from "./routes/carro.js"
import compradorRoutes from "./routes/comprador.js"
import vendaCarrosRoutes from "./routes/vendaCarros.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import loginRoutes from "./routes/login.js"
import backupRoutes from './routes/backup.js'


app.use(express.json())  // middleware para aceitar dados no formato JSON

app.use("/carro", carrosRoutes)
app.use("/comprador", compradorRoutes)
app.use("/vendaCarros", vendaCarrosRoutes)
app.use("/usuario", usuarioRoutes)
app.use("/login",loginRoutes )
app.use("/backup", backupRoutes )
app.get('/', (req, res) => {
  res.send('API: Loja de Carros')

})


app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port} graças a deus !`)
})
