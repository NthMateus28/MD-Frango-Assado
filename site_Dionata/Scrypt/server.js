const mysql = require("mysql");

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: "seu_host",
    user: "seu_usuario",
    password: "sua_senha",
    database: "seu_banco_de_dados",
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        throw err;
    }
    console.log("Conexão bem sucedida!");
});

// Dados do cliente
const clienteData = {
    nome: "Nome do Cliente",
    telefone: "123456789",
    tipo_retirada: "Tele Entrega",
    bairro: "Bairro do Cliente",
    endereco: "Endereço do Cliente",
    forma_pagamento: "Cartão de Crédito",
};

// Inserir cliente na tabela Clientes
connection.query(
    "INSERT INTO Clientes SET ?",
    clienteData,
    (error, results) => {
        if (error) throw error;
        console.log("Cliente inserido com sucesso!");
    }
);

// Fecha a conexão com o banco de dados ao final das operações
connection.end();
