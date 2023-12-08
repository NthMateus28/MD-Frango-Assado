document.addEventListener("DOMContentLoaded", () => {
    const telefoneInput = document.getElementById("telefone");

    // Função para aplicar a máscara de telefone e limitar o número de caracteres
    telefoneInput.addEventListener("input", function (event) {
        const input = event.target;
        const inputLength = input.value.length;

        if (isNaN(input.value[inputLength - 1])) {
            input.value = input.value.substring(0, inputLength - 1);
            return;
        }

        if (inputLength === 1) {
            input.value = `(${input.value}`;
        } else if (inputLength === 3) {
            input.value = `${input.value}) `;
        } else if (inputLength === 10) {
            input.value = `${input.value}-`;
        } else if (inputLength > 15) {
            input.value = input.value.substring(0, 15);
        }
    });

    const table = document.querySelector("table");
    let finalPrice = document.getElementById("finalPrice");
    let finalFrete = document.getElementById("finalFrete");
    let finalTotal = document.getElementById("finalTotal");
    const teleEntregaRadio = document.getElementById("teleEntrega");
    const tirarBalcaoRadio = document.getElementById("tirarBalcao");
    const bairrosLabel = document.querySelector('label[for="bairros"]');
    const bairrosSelect = document.getElementById("bairros");
    const enderecoLabel = document.querySelector('label[for="endereco"]');
    const enderecoInput = document.getElementById("endereco");
    const formaPagamentoLabel = document.querySelector(
        'label[for="formaPagamento"]'
    );
    const formaPagamentoSelect = document.getElementById("formaPagamento");

    function mostrarOcultarCamposTeleEntrega() {
        if (teleEntregaRadio.checked) {
            // Se Tele-Entrega estiver selecionado, mostra os elementos
            bairrosLabel.style.display = "block";
            bairrosSelect.style.display = "block";
            enderecoLabel.style.display = "block";
            enderecoInput.style.display = "block";
            formaPagamentoLabel.style.display = "block";
            formaPagamentoSelect.style.display = "block";
        } else {
            // Caso contrário, esconde os elementos
            bairrosLabel.style.display = "none";
            bairrosSelect.style.display = "none";
            enderecoLabel.style.display = "none";
            enderecoInput.style.display = "none";
            formaPagamentoLabel.style.display = "none";
            formaPagamentoSelect.style.display = "none";
        }
    }

    function calcularFrete() {
        const valorBairro =
            bairrosSelect.options[bairrosSelect.selectedIndex].getAttribute(
                "data-frete"
            );
        finalFrete.textContent = `R$${valorBairro}`;
        calcularTotal();
    }

    function calcularTotal() {
        const valorProdutos = parseFloat(
            finalPrice.textContent.replace("R$", "")
        );
        const valorFrete = parseFloat(finalFrete.textContent.replace("R$", ""));
        const total = valorProdutos + valorFrete;
        finalTotal.textContent = `R$${total.toFixed(2)}`;
    }

    function salvarPedidoLocal() {
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const tipoRetirada = document.querySelector(
            'input[name="retirada"]:checked'
        ).value;
        const bairro = document.getElementById("bairros").value;
        const endereco = document.getElementById("endereco").value;
        const formaPagamento = document.getElementById("formaPagamento").value;
        const somaProdutos = document.getElementById("finalPrice").textContent;
        const frete = document.getElementById("finalFrete").textContent;
        const total = document.getElementById("finalTotal").textContent;

        const pedido = {
            nome,
            telefone, // Salvar o valor do telefone, não a referência do elemento
            tipoRetirada,
            bairro,
            endereco,
            formaPagamento,
            somaProdutos,
            frete,
            total,
        };

        // Salvar os dados do pedido no localStorage
        localStorage.setItem("pedido", JSON.stringify(pedido));
    }

    function enviarPedidoWhatsApp() {
        const pedido = JSON.parse(localStorage.getItem("pedido"));

        let mensagem = `Quero realizar meu pedido! Segue os dados do meu Pedido:\n\n`;
        mensagem += `*Nome:* ${pedido.nome}\n`;
        mensagem += `*Telefone:* ${pedido.telefone}\n`;
        mensagem += `*Tipo de retirada:* ${pedido.tipoRetirada}\n`;

        if (pedido.tipoRetirada === "Tele Entrega") {
            mensagem += `*Bairro:* ${pedido.bairro}\n`;
            mensagem += `*Endereço:* ${pedido.endereco}\n`;
        }

        if (pedido.formaPagamento === "PIX") {
            mensagem += `*Forma de pagamento:* ${pedido.formaPagamento}\n`;
            mensagem += `*Chave PIX:* Adicione aqui a chave PIX para pagamento\n\n`;
        } else {
            mensagem += `*Forma de pagamento:* ${pedido.formaPagamento}\n`;
        }

        mensagem += `*Produtos Selecionados:*\n`;

        // Adicionando detalhes dos produtos
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith("produto_")) {
                let produto = JSON.parse(localStorage.getItem(key));
                mensagem += `-${produto.nome}: ${produto.quantidade}x - R$${(
                    produto.valor * produto.quantidade
                ).toFixed(2)}\n`;
            }
        }

        mensagem += `\n*Soma dos produtos:* ${pedido.somaProdutos}\n`;
        mensagem += `*Frete:* ${pedido.frete}\n`;
        mensagem += `*Total:* ${pedido.total}\n\n`;
        mensagem += `*CASO QUEIRA ACOMPANHAR SEU PEDIDO É SÓ CLICAL NO SEGUINTE LINK:*\n\n`;
        mensagem += `https://bit.ly/Acompanhar_Pedido`;

        const linkWhatsApp = `https://api.whatsapp.com/send?phone=5554991965403&text=${encodeURIComponent(
            mensagem
        )}`;

        window.open(linkWhatsApp, "_blank");
    }

    const salvarPedidoButton = document.getElementById("enviarPedidoButton");
    salvarPedidoButton.addEventListener("click", salvarPedidoLocal);

    teleEntregaRadio.addEventListener("change", () => {
        mostrarOcultarCamposTeleEntrega();
        calcularFrete();
    });

    tirarBalcaoRadio.addEventListener("change", () => {
        mostrarOcultarCamposTeleEntrega();
        calcularFrete();
    });

    bairrosSelect.addEventListener("change", calcularFrete);

    // Chama o evento de mudança inicialmente para esconder os elementos se Tele-Entrega não estiver selecionado
    mostrarOcultarCamposTeleEntrega();

    window.onload = () => {
        let total = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith("produto_")) {
                let produto = JSON.parse(localStorage.getItem(key));
                total += produto.valor * produto.quantidade;

                // Cria uma nova linha na tabela para cada produto
                let newRow = document.createElement("tr");
                let nameCell = document.createElement("td");
                let valorCell = document.createElement("td");
                let quantidadeCell = document.createElement("td");

                // Define o conteúdo das células com os valores do produto
                nameCell.textContent = produto.nome;
                valorCell.textContent = `R$${(
                    produto.valor * produto.quantidade
                ).toFixed(2)}`;
                quantidadeCell.textContent = produto.quantidade;

                newRow.appendChild(nameCell);
                newRow.appendChild(valorCell);
                newRow.appendChild(quantidadeCell);
                table.appendChild(newRow);
            }
        }

        finalPrice.textContent = `R$${total.toFixed(2)}`;
        calcularTotal(); // Chama o cálculo do total após carregar os produtos
    };

    const enviarPedidoButton = document.getElementById("enviarPedidoButton");
    enviarPedidoButton.addEventListener("click", enviarPedidoWhatsApp);
});
