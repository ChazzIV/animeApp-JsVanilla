const base_url = "https://api.jikan.moe/v3";
const url_top = "https://api.jikan.moe/v3/top/anime/1/upcoming";



function getAnime() {
    fetch(`${base_url}/top/anime/1/upcoming`)
    .then(res => res.json())
    .then(data => console.log(data));
}


function searchAnime(event){

    event.preventDefault();

    const form = new FormData(this);
    const query = form.get("search");

    // console.log(query);

    fetch(`${base_url}/search/anime?q=${query}&page=1`)
    .then(res=>res.json())
    .then(updateDom)
    .catch(err=>console.warn(err.message));
}


function updateDom(data) {

    const searchResults = document.getElementById('search-results');
    
    const animeByCategories =  data.results
        .reduce((acc, anime) => {
            const {type} = anime;
            if (acc[type] === undefined) acc[type] = [];
            acc[type].push(anime);
            return acc;
        }, {} );


        searchResults.innerHTML = Object.keys(animeByCategories).map( key => {

            const animesHTML = animeByCategories[key]
            .sort((a,b) => a.episodes-b.episodes)
            .map(anime => {
                return `
                <div class="card">
                    <div class="card-image">
                        <img src="${anime.image_url}" />
                    </div>
                    <div class="card-content">
                        <span class="card-title">${anime.title}</span>
                        <p> ${anime.synopsis} </p>
                    </div>
                    <div class="card-action">
                        <a href="${anime.url}">Find out more</a>
                    </div>
                </div>
                `
            }).join("");

            return `
            <section>
                <h3>${key.toLowerCase()}</h3>
                <div class="contenedor-row">${animesHTML}</div>
            </section>
            `
        }).join("");
        
    
    data.results
        .sort((a,b) => a.episodes-b.episodes)
        .forEach(anime=> console.log(anime));
}

const pageLoaded = () => {
  const form = document.getElementById("search_form");
  form.addEventListener('submit', searchAnime)
}

window.addEventListener('load', pageLoaded);
window.addEventListener('load', getAnime);