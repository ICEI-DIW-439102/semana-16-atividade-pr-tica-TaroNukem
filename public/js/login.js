const API_USUARIOS = "http://localhost:3000/usuarios";

/* ================= LOGIN ================= */

async function logar() {

    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const erro = document.getElementById("erro");

    erro.innerText = "";

    if (login === "" || senha === "") {
        erro.innerText = "Preencha todos os campos.";
        return;
    }

    try {

        const res = await fetch(API_USUARIOS);
        const usuarios = await res.json();

        const usuario = usuarios.find(u =>
            u.login === login &&
            u.senha === senha
        );

        if (!usuario) {
            erro.innerText = "Usuário ou senha inválidos.";
            return;
        }

        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuario)
        );

        window.location.href = "index.html";

    } catch {

        erro.innerText = "Erro ao conectar ao servidor.";

    }

}

/* ================= CADASTRO ================= */

async function cadastrar() {

    const login = document.getElementById("novoLogin").value.trim();
    const senha = document.getElementById("novaSenha").value.trim();
    const erro = document.getElementById("erro");

    erro.innerText = "";

    if (login === "" || senha === "") {
        erro.innerText = "Preencha todos os campos.";
        return;
    }

    try {

        const res = await fetch(API_USUARIOS);
        const usuarios = await res.json();

        const existe = usuarios.find(u => u.login === login);

        if (existe) {
            erro.innerText = "Esse usuário já existe.";
            return;
        }

        const novoUsuario = {

            login: login,
            senha: senha,
            nome: login,
            email: "",
            admin: false

        };

        await fetch(API_USUARIOS, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(novoUsuario)

        });

        alert("Usuário cadastrado com sucesso!");

        document.getElementById("novoLogin").value = "";
        document.getElementById("novaSenha").value = "";

    } catch {

        erro.innerText = "Erro ao cadastrar usuário.";

    }

}

/* ================= MENU ================= */

function atualizarMenu() {

    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const cadastroBtn = document.getElementById("cadastroBtn");

    if (loginBtn && logoutBtn) {

        if (usuario) {

            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";

        } else {

            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";

        }

        logoutBtn.onclick = () => {

            sessionStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";

        };

    }

    if (cadastroBtn) {

        if (usuario && usuario.admin === true) {

            cadastroBtn.style.display = "block";

        } else {

            cadastroBtn.style.display = "none";

        }

    }

}

document.addEventListener("DOMContentLoaded", atualizarMenu);