const express = require("express");
const app = express();
const PORT = 3000;

let pedidos = [];

app.use(express.json());

// Rota para receber os pedidos
app.post("/receberPedido", (req, res) => {
    const novoPedido = req.body;
    pedidos.push(novoPedido);
    res.json({ message: "Pedido recebido com sucesso!" });
});

// Rota para fornecer os dados dos pedidos
app.get("/pedidos", (req, res) => {
    res.json(pedidos);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
