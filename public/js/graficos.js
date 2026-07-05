const API_URL = "http://localhost:3000/autores";

async function carregarGrafico(){

    const res = await fetch(API_URL);
    const autores = await res.json();

    const contagem = {};

    autores.forEach(a => {
        contagem[a.categoria] = (contagem[a.categoria] || 0) + 1;
    });

    new Chart(document.getElementById("grafico"), {
        type: "pie",
        data: {
            labels: Object.keys(contagem),
            datasets: [{
                data: Object.values(contagem)
            }]
        }
    });
}

carregarGrafico();