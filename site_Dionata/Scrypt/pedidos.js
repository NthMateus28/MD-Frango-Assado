document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dadosCodificados = urlParams.get("dados");

    if (dadosCodificados) {
        const dadosDecodificados = JSON.parse(
            decodeURIComponent(dadosCodificados)
        );

        // Agora você tem os dados disponíveis para uso na página de destino
        const produtos = dadosDecodificados.produtos;
        const cliente = dadosDecodificados.cliente;

        // Faça o que for necessário com esses dados na página de destino
        console.log(produtos);
        console.log(cliente);
    }

    let pedidoSalvo = localStorage.getItem("pedido");

    function gerarPDF() {
        const element = document.querySelector("article");
        const btn = document.querySelector(".enviarWhats");

        // Salva o estilo atual do botão
        const btnDisplayStyle = btn.style.display;

        // Torna o botão invisível temporariamente
        btn.style.display = "none";

        const opt = {
            margin: [0, 0, 0, 0], // Margens: [topo, direita, baixo, esquerda]
            filename: "pedido.pdf",
            image: { type: "pdf", quality: 1 }, // Alterado de 0.98 para 1
            html2canvas: { scale: 2 }, // Ajustado a escala para 2
            jsPDF: {
                unit: "mm",
                format: "a4",
                // orientation: "portrait",
                floatPrecision: 16,
                putOnlyUsedFonts: true,
                compress: true,
            },
        };

        // Criar o PDF usando html2pdf.js
        html2pdf()
            .from(element)
            .set(opt)
            .save()
            .then(() => {
                // Restaura o estilo original do botão para torná-lo visível novamente
                btn.style.display = btnDisplayStyle;
                enviarPedidoWhatsApp();
            });
    }

    const article = document.querySelector("article");
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

        // <p>Total dos Itens: R$${totalItens}</p>

        const totalPedido = pedido.total; // Obter o total do pedido
        pedidoHTML += `<tr><td>Total do Pedido:</td><td> ${totalPedido}</td></tr></p>`;
        const divContent = document.createElement("div");
        divContent.innerHTML = pedidoHTML; // Adiciona o conteúdo do pedido ao div

        // Cria e adiciona o botão ao div fora do article

        const btn = document.createElement("button");
        btn.textContent = "Baixar Pedido";
        btn.classList.add("enviarWhats", "no-print");

        btn.onclick = gerarPDF;
        divContent.appendChild(btn);

        // Adiciona o div com o conteúdo do pedido e o botão ao documento
        article.appendChild(divContent);
    } else {
        article.innerHTML += `<p>Nenhum pedido encontrado.</p>`;
    }
});
