/**
 *
 * Constantes gerais da aplicação
 */
const searchBaseUrl = "https://api.themoviedb.org/3/search/movie";
const baseUrlApi = "https://api.themoviedb.org/3/movie/";
const apiKey = "?api_key=" + APIKEY;
const languageApi = "&language=pt-BR&include_image_language=pt-BR,null";
const baseUrlImage = "https://image.tmdb.org/t/p/";

/**
 *
 * Utilidades
 * Funções de apoio ao desenvolvimento
 */

// Função para pegar o parametro que vem na URL
function getParameter(parameterName) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

// Função para buscar a imagem
function getImage(tamanho = "medio", id = 550) {
    let largura = tamanho !== "medio" ? 1280 : 500;
    return baseUrlImage + "w" + largura + id;
}

// Função para buscar filmes na API
async function getMovies(list = "now_playing") {
    let urlApi = baseUrlApi + list + apiKey + languageApi;
    let resultado = await fetch(urlApi);
    //console.log(resultado);
    return await resultado.json();
}

// Função para procurar filmes com base em um texto
async function searchMovies(texto) {
    let urlApi = searchBaseUrl + apiKey + "&query=" + texto + "&language=pt-BR";
    let result = await fetch(urlApi);
    let data = await result.json();
    //console.log(data);
    return data;
}

// Funcao para verificar a página atual
function isPage(pageName) {
    let pathName = window.location.pathname;
    let path = pathName.replace(".html", "");

    return path === pageName;
}

// Função para pegar o parametro de busca

let campoBusca = document.querySelector("#campo-busca");
let botaoBusca = document.querySelector("#botao-busca");

campoBusca.addEventListener("keydown", (evento) => {
    if (evento.code === "Enter") {
        let textoDaBusca = campoBusca.value;

        window.open("busca.html?busca=" + textoDaBusca, "_self");
    }
});

campoBusca.addEventListener("search", (evento) => {
    // evento.preventDefault();
    window.open("busca.html?busca=" + textoDaBusca, "_self");
});

/**
 *
 * Scripts para serem rodados na PÁGINA INICIAL
 * Buscar os filmes em cartaz na API e gerar o HTML na lista
 * que está no index.html
 */

// Verificar se estamos na Home
if (isPage("/") || isPage("/index")) {
    const listaWrapper = document.querySelector(".lista-filmes");

    getMovies().then((dados) => {
        //console.log("Filmes em cartaz", data);
        let filmesArr = dados.results;

        filmesArr.forEach((filme) => {
            let listItem = document.createElement("div");
            listItem.classList.add("col-md-6", "col-lg-3", "mb-4");

            let listaHtml = `
                <a href="filme.html?id=${filme.id}" class="filme">
                    <figure>
                    <img
                    class="img-fluid"
                    src="${getImage("medio", filme.poster_path)}"
                    alt="Pôster do filme ${filme.title}"
                />
                    </figure>

                    <h6>${filme.title}</h6>
                    <p>
                        <span>${filme.release_date}</span>
                        <b>Classificação: ${filme.vote_average}</b>
                    </p>
                </a>
            `;

            listItem.innerHTML = listaHtml;

            listaWrapper.appendChild(listItem);
        });
    });
}

/**
 *
 * Scripts para serem rodados na PÁGINA DE DETALHES DO FILME
 * Buscar os detalhes do filme pelo ID na API e gerar o HTML na página
 * que está no filme.html
 * O ID do filme está disponível no parâmetro ID da URL.
 */

// Verificar se estamos na Home

if (isPage("/filme")) {
    console.log("página filme ok");

    const filmeId = getParameter("id");

    getMovies(filmeId).then((filme) => {
        //console.log("este é o filme", filme);

        const filmeCapa = document.querySelector("#filme-capa");

        let generos = filme.genres.map((item) => item.name).join(", ");

        let capaHtml = `
      <img
      src="${getImage("", filme.backdrop_path)}"
      alt=""
      srcset=""
    />
    <div class="info">
      <h2>${filme.title}</h2>
      <div class="classificacao">
        <span>${
            filme.release_date
        }</span> | <span><b>Gênero(s):</b> ${generos}</span>
      </div>
      <p>
      ${filme.overview}
      </p>

    <a  href="${
        filme.homepage
    }" class="btn btn-primary"><i class="bi bi-link-45deg"></i>Site do filme</a>
    </div>
    
      `;
        console.log(filme);
        filmeCapa.innerHTML = capaHtml;
    });
}

/**
 *
 * Página de busca
 */

if (isPage("/busca")) {
    let termoDeBusca = getParameter("busca");

    const listaWrapper = document.querySelector(".lista-filmes");
    const textoParametro = document.querySelector("#parametro");
    textoParametro.textContent = termoDeBusca;

    searchMovies(termoDeBusca).then((dados) => {
        //console.log("Filmes em cartaz", data);
        let filmesArr = dados.results;

        filmesArr.forEach((filme) => {
            let listItem = document.createElement("div");
            listItem.classList.add("col-md-6", "col-lg-3", "mb-4");

            let listaHtml = `
                <a href="filme.html?id=${filme.id}" class="filme">
               
                <figure>
                <img
                        class="img-fluid"
                        src="${getImage("medio", filme.poster_path)}"
                        alt="Pôster do filme ${filme.title}"
                    />
                </figure>    
                
                    <h6>${filme.title}</h6>
                    <p>
                        <span>${filme.release_date}</span>
                        <b>Classificação: ${filme.vote_average}</b>
                    </p>
                </a>
            `;

            listItem.innerHTML = listaHtml;

            listaWrapper.appendChild(listItem);
        });
    });
}
