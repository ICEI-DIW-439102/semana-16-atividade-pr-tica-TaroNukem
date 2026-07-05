const API_URL = "http://localhost:3000/autores";

/* ===================== STORAGE ===================== */

function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(favs) {
    localStorage.setItem("favoritos", JSON.stringify(favs));
}

/* ===================== FAVORITOS ===================== */

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

function isFavorito(id) {
    return getFavoritos().some(a => a.id == id);
}

/* ===================== BOTÃO ===================== */

function criarBotaoFavorito(autor) {
    const btn = document.createElement("button");
    btn.className = "btn-fav";

    function atualizarTexto() {
        btn.innerText = isFavorito(autor.id)
            ? "❤️ Remover dos favoritos"
            : "🤍 Favoritar";
    }

    atualizarTexto();

    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleFavorito(autor);
        atualizarTexto();
        renderFavoritos();
    };

    return btn;
}

/* ===================== LISTA FAVORITOS ===================== */

function renderFavoritos() {
    const el = document.getElementById("lista-favoritos");
    if (!el) return;

    const favs = getFavoritos();

    el.innerHTML = "";

    if (favs.length === 0) {
        el.innerHTML = "<p>Você ainda não possui autores favoritos.</p>";
        return;
    }

    favs.forEach(autor => {

        const card = document.createElement("div");
        card.className = "card-livro";

        card.innerHTML = `
            <a href="detalhes.html?id=${autor.id}" style="text-decoration:none;color:inherit;">
                <img src="${autor.imagem}">
                <h2>${autor.nome}</h2>
                <p>${autor.categoria}</p>
            </a>
        `;

        const btn = criarBotaoFavorito(autor);

        card.appendChild(btn);

        el.appendChild(card);
    });
}

/* ===================== BOTÃO NA TELA DE DETALHES ===================== */

function inserirBotaoDetalhes() {
    const container = document.getElementById("detalhes");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(autor => {

            const btn = criarBotaoFavorito(autor);

            container.appendChild(btn);

        });
}

/* ===================== INIT ===================== */

renderFavoritos();
inserirBotaoDetalhes();