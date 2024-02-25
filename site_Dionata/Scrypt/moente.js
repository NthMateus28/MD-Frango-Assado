document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product");
    const valorFinalElement = document.querySelector(".resultadoFinal");
    const precos = [45, 55, 45, 50, 48, 5, 3, 2, 6, 6, 4.5, 15, 12];

    // Sua configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBHtmcLp__TN7bJuc57P5hVYEXQxxmIPO4",
        authDomain: "md-franfo-assado.firebaseapp.com",
        databaseURL: "https://md-franfo-assado-default-rtdb.firebaseio.com",
        projectId: "md-franfo-assado",
        storageBucket: "md-franfo-assado.appspot.com",
        messagingSenderId: "437304446925",
        appId: "1:437304446925:web:b60110b532736da8867e84",
        measurementId: "G-2DSPDTRXSE",
    };

    // Inicialize o app Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = app.database(); // Inicialize o Realtime Database

    // Função para carregar a disponibilidade dos produtos do Firebase
    function carregarDisponibilidade() {
        const disponibilidadeRef = database.ref("produtos");
        disponibilidadeRef.on(
            "value",
            (snapshot) => {
                const disponibilidadeProdutos = snapshot.val();
                atualizarVisibilidade(disponibilidadeProdutos);
            },
            (errorObject) => {
                console.error("Erro ao carregar disponibilidade:", errorObject);
            }
        );
    }

    // Atualizar visibilidade dos produtos com base na disponibilidade
    function atualizarVisibilidade(disponibilidadeProdutos) {
        products.forEach((product, index) => {
            const tarja = document.createElement("div");
            tarja.classList.add("tarja");

            if (
                disponibilidadeProdutos &&
                disponibilidadeProdutos[index + 1] &&
                disponibilidadeProdutos[index + 1].disponibilidade === false
            ) {
                const buttonContainer =
                    product.querySelector(".button-container");
                const btnAdicionar = product.querySelector(".btnAdicionar");
                const btnRetirar = product.querySelector(".btnRetirar");
                const titleProduct = product.querySelector(".titleProduct");

                product.appendChild(tarja);
                buttonContainer.style.display = "none";
                titleProduct.childNodes[2].textContent = "Indisponível";
                titleProduct.childNodes[3].style.display = "none";
                titleProduct.childNodes[4].style.display = "none";
                titleProduct.childNodes[5].style.display = "none";

                btnAdicionar.removeEventListener("click", () => {});
                btnRetirar.removeEventListener("click", () => {});
            } else {
                const tarja = product.querySelector(".tarja");
                if (tarja) {
                    tarja.remove();
                }
            }
        });
    }

    // Chamada para carregar a disponibilidade dos produtos
    carregarDisponibilidade();

    localStorage.clear();

    function calcularValorTotal() {
        let valorTotal = 0;

        products.forEach((product, index) => {
            const unidade = product.querySelector(".unidade");
            const quantidade = parseInt(unidade.textContent);
            const precoUnitario = precos[index];
            valorTotal += quantidade * precoUnitario;
        });

        return valorTotal.toFixed(2);
    }

    function atualizarValorFinal() {
        const valorTotal = calcularValorTotal();
        valorFinalElement.textContent = valorTotal;
    }

    function salvarProduto(index, quantidade) {
        const product = products[index]; // Correção aqui
        const titleProduct = product.querySelector(".titleProduct");
        const unidade = product.querySelector(".unidade");

        if (titleProduct && unidade) {
            const nome = titleProduct.childNodes[0].nodeValue.trim();
            const valor = parseFloat(titleProduct.textContent.split("R$")[1]);
            const produto = {
                nome: nome,
                valor: valor,
                quantidade: quantidade,
            };

            if (quantidade === 0) {
                localStorage.removeItem(`produto_${index}`);
            } else {
                localStorage.setItem(
                    `produto_${index}`,
                    JSON.stringify(produto)
                );
            }
        } else {
            console.error(
                "Elementos não encontrados para o produto de índice " + index
            );
        }
    }

    products.forEach((product, index) => {
        const btnAdicionar = product.querySelector(".btnAdicionar");
        const btnRetirar = product.querySelector(".btnRetirar");
        const unidade = product.querySelector(".unidade");

        btnAdicionar.addEventListener("click", () => {
            let valorAtual = parseInt(unidade.textContent);
            unidade.textContent = valorAtual + 1;

            salvarProduto(index, valorAtual + 1);
            atualizarValorFinal();
        });

        btnRetirar.addEventListener("click", () => {
            let valorAtual = parseInt(unidade.textContent);
            if (valorAtual > 0) {
                unidade.textContent = valorAtual - 1;
                salvarProduto(index, valorAtual - 1);
                atualizarValorFinal();
            }
        });
    });

    // Desabilita todos os produtos indisponíveis de uma vez
    function desabilitarProdutosIndisponiveis(disponibilidadeProdutos) {
        products.forEach((product, index) => {
            const tarja = product.querySelector(".tarja");
            if (
                disponibilidadeProdutos &&
                disponibilidadeProdutos[index + 1] &&
                disponibilidadeProdutos[index + 1].disponibilidade === false
            ) {
                if (!tarja) {
                    const buttonContainer =
                        product.querySelector(".button-container");
                    const btnAdicionar = product.querySelector(".btnAdicionar");
                    const btnRetirar = product.querySelector(".btnRetirar");
                    const titleProduct = product.querySelector(".titleProduct");

                    const tarja = document.createElement("div");
                    tarja.classList.add("tarja");
                    product.appendChild(tarja);

                    buttonContainer.style.display = "none";
                    titleProduct.childNodes[2].textContent = "Indisponível";
                    titleProduct.childNodes[3].style.display = "none";
                    titleProduct.childNodes[4].style.display = "none";
                    titleProduct.childNodes[5].style.display = "none";

                    btnAdicionar.removeEventListener("click", () => {});
                    btnRetirar.removeEventListener("click", () => {});
                }
            } else {
                if (tarja) {
                    tarja.remove();
                }
            }
        });
    }

    // Inicialmente, desabilita os produtos indisponíveis
    carregarDisponibilidade();

    database.ref("produtos").on("value", (snapshot) => {
        const disponibilidadeProdutos = snapshot.val();
        desabilitarProdutosIndisponiveis(disponibilidadeProdutos);
    });
});
