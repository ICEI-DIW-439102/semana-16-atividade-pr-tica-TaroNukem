const API_URL = "http://localhost:3000/autores";

/* ===================== FAVORITOS ===================== */

function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(favs) {
    localStorage.setItem("favoritos", JSON.stringify(favs));
}

function isFavorito(id) {
    return getFavoritos().some(a => a.id == id);
}

function toggleFavorito(autor) {
    let favs = getFavoritos();

    const existe = favs.find(a => a.id == autor.id);

    if (existe) {
        favs = favs.filter(a => a.id != autor.id);
    } else {
        favs.push(autor);
    }

    salvarFavoritos(favs);
}

/* ===================== FETCH ===================== */

async function getAutores() {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (e) {
        return [];
    }
}

/* ===================== CARD ===================== */

function card(a) {
    const div = document.createElement("div");
    div.className = "card-livro";

    div.innerHTML = `
        <a href="detalhes.html?id=${a.id}" style="text-decoration:none;color:inherit;">
            <img src="${a.imagem}">
            <h2>${a.nome}</h2>
            <p>${a.categoria}</p>
        </a>
    `;

    const btn = document.createElement("button");
    btn.className = "btn-fav";

    function atualizarBotao() {
        btn.innerText = isFavorito(a.id)
            ? "❤️ Remover dos favoritos"
            : "🤍 Favoritar";
    }

    atualizarBotao();

    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleFavorito(a);
        atualizarBotao();
    };

    div.appendChild(btn);

    return div;
}

/* ===================== RENDER ===================== */

function render(lista) {
    const el = document.getElementById("lista-autores");
    if (!el) return;

    el.innerHTML = "";

    lista.forEach(a => {
        el.appendChild(card(a));
    });
}

/* ===================== SLIDER ===================== */

function slider(autores) {
    const el = document.getElementById("slide-container");
    if (!el) return;

    const destaques = autores.filter(a => a.destaque);

    if (!destaques.length) return;

    let i = 0;

    function show() {
        const a = destaques[i];

        el.innerHTML = `
            <a href="detalhes.html?id=${a.id}" style="text-decoration:none;color:inherit;">
                <div class="slide-card">
                    <img src="${a.imagem}">
                    <div class="slide-info">
                        <h2>${a.nome}</h2>
                        <p>${a.descricaoCurta}</p>
                    </div>
                </div>
            </a>
        `;
    }

    show();

    document.getElementById("proximo").onclick = () => {
        i = (i + 1) % destaques.length;
        show();
    };

    document.getElementById("anterior").onclick = () => {
        i = (i - 1 + destaques.length) % destaques.length;
        show();
    };
}

/* ===================== BUSCA ===================== */

function busca(autores) {
    const input = document.getElementById("busca");
    if (!input) return;

    input.addEventListener("input", (e) => {
        const texto = e.target.value.toLowerCase();

        const filtrados = autores.filter(a =>
            a.nome.toLowerCase().includes(texto) ||
            a.categoria.toLowerCase().includes(texto)
        );

        render(filtrados);
    });
}

/* ===================== DETALHES ===================== */

async function carregarDetalhes() {
    const container = document.getElementById("detalhes");
    const livros = document.getElementById("livros");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`${API_URL}/${id}`);
    const a = await res.json();

    container.innerHTML = `
        <div class="perfil-detalhe">
            <img src="${a.imagem}">
            <div>
                <h1>${a.nome}</h1>
                <p>${a.descricaoCompleta}</p>

                <p><strong>Movimento:</strong> ${a.movimento}</p>
                <p><strong>Categoria:</strong> ${a.categoria}</p>
                <p><strong>Nascimento:</strong> ${a.nascimento}</p>
                <p><strong>Nacionalidade:</strong> ${a.nacionalidade}</p>
            </div>
        </div>
    `;

    const btn = document.createElement("button");
    btn.className = "btn-fav";

    function atualizarBotao() {
        btn.innerText = isFavorito(a.id)
            ? "❤️ Remover dos favoritos"
            : "🤍 Favoritar";
    }

    atualizarBotao();

    btn.onclick = () => {
        toggleFavorito(a);
        atualizarBotao();
    };

    container.appendChild(btn);

    livros.innerHTML = "";

    a.livros.forEach(l => {
        livros.innerHTML += `
            <div class="card-livro">
                <img src="${l.imagem}">
                <h3>${l.titulo}</h3>
                <p>${l.descricao}</p>
            </div>
        `;
    });
}

/* ===================== INIT ===================== */

async function init() {
    const autores = await getAutores();

    render(autores);
    slider(autores);
    busca(autores);
}

init();
carregarDetalhes();

/* ===================== MENU ===================== */

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

atualizarMenu();