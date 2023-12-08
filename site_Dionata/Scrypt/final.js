document.addEventListener("DOMContentLoaded", () => {
    const article = document.querySelector("article");

    function criarTabelaPedido() {
        const pedidoSalvo = localStorage.getItem("pedido");

        if (pedidoSalvo) {
            const pedido = JSON.parse(pedidoSalvo);

            let pedidoHTML = `<h2>Dados do Pedido:</h2>`;
            pedidoHTML += `<table border="1";">
                            <!-- Detalhes do Pedido -->`;

            for (const key in pedido) {
                if (key !== "produtos") {
                    pedidoHTML += `<tr>
                                        <td>${key}</td>
                                        <td>${pedido[key]}</td>
                                    </tr>`;
                }
            }

            pedidoHTML += `</table>
                            <h2>Itens do Pedido:</h2>
                            <table border="1";">
                                <tr>
                                    <th>Nome do Produto</th>
                                    <th>Valor Unitário</th>
                                    <th>Quantidade</th>
                                </tr>`;

            let totalItens = 0; // Inicializa o total dos produtos

            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key.startsWith("produto_")) {
                    let produto = JSON.parse(localStorage.getItem(key));
                    totalItens += produto.valor * produto.quantidade;
                    pedidoHTML += `<tr>
                                        <td>${produto.nome}</td>
                                        <td>R$${produto.valor}</td>
                                        <td>${produto.quantidade}</td>
                                    </tr>`;
                }
            }
            pedidoHTML += `</table>
                            <p></p>
                            <table border="1";  style="margin-top: 10px; font-size: 1.5rem">
                                <tr>
                                    <td>Total dos Itens:</td>
                                    <td>R$${totalItens}</td>
                                </tr>
                            `;

            const totalPedido = pedido.total; // Obter o total do pedido
            pedidoHTML += `<tr><td>Total do Pedido:</td><td> ${totalPedido}</td></tr></p>`;

            const divContent = document.createElement("div");
            divContent.innerHTML = pedidoHTML; // Adiciona o conteúdo do pedido ao div

            // Adiciona o div com o conteúdo do pedido ao article
            article.appendChild(divContent);
        } else {
            article.innerHTML += `<p>Nenhum pedido encontrado.</p>`;
        }
    }

    // Chama a função para criar a tabela do pedido
    criarTabelaPedido();
});
