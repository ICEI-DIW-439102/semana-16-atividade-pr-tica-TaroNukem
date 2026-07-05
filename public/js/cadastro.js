const API_URL = "http://localhost:3000/autores";

/* ===================== VERIFICAR ADMIN ===================== */

const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

if (!usuario || usuario.admin !== true) {
    alert("Acesso permitido apenas para administradores.");
    window.location.href = "index.html";
}

/* ===================== MENU ===================== */

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (loginBtn && logoutBtn) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";

    logoutBtn.onclick = () => {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
    };
}

/* ===================== LISTAR ===================== */

async function carregarAutores() {

    const res = await fetch(API_URL);
    const autores = await res.json();

    const lista = document.getElementById("listaAutores");

    lista.innerHTML = "";

    autores.forEach(a => {

        lista.innerHTML += `
        <tr>
            <td>${a.nome}</td>
            <td>${a.categoria}</td>

            <td>
                <button onclick="editarAutor('${a.id}')">
                    Editar
                </button>

                <button onclick="excluirAutor('${a.id}')">
                    Excluir
                </button>
            </td>
        </tr>
        `;

    });

}

/* ===================== CADASTRAR / EDITAR ===================== */

document.getElementById("formAutor").addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document.getElementById("id").value;

    const autor = {

        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        imagem: document.getElementById("imagem").value,
        descricaoCurta: document.getElementById("descricaoCurta").value,
        descricaoCompleta: document.getElementById("descricaoCompleta").value,
        nascimento: document.getElementById("nascimento").value,
        nacionalidade: document.getElementById("nacionalidade").value,
        movimento: document.getElementById("movimento").value,
        destaque: document.getElementById("destaque").value === "true",

        valor: "",

        tags: [],

        livros: []

    };

    if(id == ""){

        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(autor)

        });

    }else{

        await fetch(`${API_URL}/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                id:id,
                ...autor
            })

        });

    }

    document.getElementById("formAutor").reset();

    document.getElementById("id").value="";

    carregarAutores();

});

/* ===================== EDITAR ===================== */

async function editarAutor(id){

    const res = await fetch(`${API_URL}/${id}`);

    const a = await res.json();

    document.getElementById("id").value = a.id;
    document.getElementById("nome").value = a.nome;
    document.getElementById("categoria").value = a.categoria;
    document.getElementById("imagem").value = a.imagem;
    document.getElementById("descricaoCurta").value = a.descricaoCurta;
    document.getElementById("descricaoCompleta").value = a.descricaoCompleta;
    document.getElementById("nascimento").value = a.nascimento;
    document.getElementById("nacionalidade").value = a.nacionalidade;
    document.getElementById("movimento").value = a.movimento;
    document.getElementById("destaque").value = a.destaque.toString();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

/* ===================== EXCLUIR ===================== */

async function excluirAutor(id){

    if(!confirm("Deseja excluir este autor?"))
        return;

    await fetch(`${API_URL}/${id}`,{

        method:"DELETE"

    });

    carregarAutores();

}

/* ===================== INIT ===================== */

carregarAutores();