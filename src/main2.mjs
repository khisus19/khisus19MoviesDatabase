import { API_KEY } from "./api_key.mjs";
import { modeladora } from "./main.mjs";
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    params: {
        "api_key": API_KEY,
    }
})

let movies = "";
let currentPage = 1;
const trendingBtn = document.getElementById("tredingDropdown");
const topRatedBtn = document.getElementById("topRatedDropdown");

const searchBtn = document.getElementById("search-btn");
const gridTitle = document.getElementById("grid-title");
const modal = document.getElementById("myModal");

/* Observer */
let observer = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting && location.hash === "#top-rated") {
            currentPage++;
            topMovies();
        } else if(entrada.isIntersecting && location.hash === "#trending") {
            currentPage++;
            trendingMovies();
        }
    })
}, {
    rootMargin: "0px 0px 300px 0px",
    threshold: 1.0
})

const trendingMovies = async() => {
    const trendingUrl = `trending/movie/week?page=${currentPage}`;
    
    const { data } = await api(trendingUrl)
    // console.log(data)

    data.results.forEach(item => movieLoader(item))
    
    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);
}

const topMovies = async() => {
    const topRatedEndpoint = `movie/top_rated?page=${currentPage}`;
    
    const { data } = await api(topRatedEndpoint)
    // console.log(data)

    data.results.forEach(item => movieLoader(item))

    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);
}

const movieLoader = (item) => {
    movies += `
        <article class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" />
            <a class="modal-anchor" href='javascript:modeladora()'>
                <div class="description" id="description">
                    <p class="year">${item.release_date.slice(0,4)}</p>
                    <h3 class="movie-title">${item.title}</h3>
                    <p class="average">${item.vote_average.toFixed(1)}</p>
                </div>
            </a>
        </article>
    `;
    document.getElementById("movies-grid-container").innerHTML = movies;

}

const searchMovie = async(query) => {
    const searchEndpoint = "search/movie";
    movies = "";

    const { data } = await api(`${searchEndpoint}`, {
        params: {
            query,
        },
    });
    if(data.message === "Request aborted"){
        console.log("Error")
        gridTitle.innerText = "Error. Try again later"
    } else {
        data.results.forEach(movie => {
            movieLoader(movie)
        })
        location.hash = `#search=${query}`;
        gridTitle.innerText = "Search"
    }
}

trendingBtn.addEventListener("click", () => {
    movies = "";
    currentPage = 1;
    trendingMovies();
    gridTitle.innerText = "Trending Movies"
    location.hash = "trending"
})
topRatedBtn.addEventListener("click", () => {
    movies = "";
    currentPage = 1;
    topMovies();
    gridTitle.innerText = "Top-rated Movies"
    location.hash = "top-rated"
})

searchBtn.addEventListener("click", () => {
    const searchInput = document.getElementById("search-input");
    movies = "";
    searchMovie(searchInput.value)
})

trendingMovies()
/* const modalBtn = document.getElementsByClassName("modal-anchor")

modalBtn.addEventListener("click", () => {
    modal.style.display = "block"
}) */

// Get the button that opens the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}