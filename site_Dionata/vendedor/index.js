import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    update,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicialize o Realtime Database

// Função para adicionar ouvintes de eventos para cada produto
function adicionarManipuladores(id) {
    const habilitarButton = document.getElementById(`habilitar-${id}`);
    const desabilitarButton = document.getElementById(`desabilitar-${id}`);

    habilitarButton.addEventListener("click", () => {
        // Aqui, você pode enviar a informação para o Firebase
        update(ref(database, `produtos/${id}`), { disponibilidade: true });
    });

    desabilitarButton.addEventListener("click", () => {
        // Aqui, você pode enviar a informação para o Firebase
        update(ref(database, `produtos/${id}`), { disponibilidade: false });
    });
}

for (let i = 1; i <= 14; i++) {
    adicionarManipuladores(i); // Adicione manipuladores para cada produto individualmente
}
