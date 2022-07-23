import { API_KEY } from "./api_key.mjs";

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
let favoritesMoviesIds = [769, 238, 5548, 11690, 429, 36557, 105, 610253, 524, 10781, 515001, 280, 938, 329, 106, 9728];
const dropdown = document.getElementById("sort-dropdown");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gridTitle = document.getElementById("grid-title");
let genreArray = [];

/* Observer */
let observer = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting && location.hash === "#top-rated") {
            currentPage++;
            topMovies();
        } else if(entrada.isIntersecting && location.hash === "#trending") {
            currentPage++;
            trendingMovies();
        } else if(entrada.isIntersecting && location.hash.startsWith("#search=")) {
            console.log(searchInput.value);
            currentPage++;
            searchMovie(searchInput.value);
        } else if(entrada.isIntersecting) {
            currentPage++;
            getMoviesByGenre(location.hash.split("-")[1])
        } 
    })
}, {
    rootMargin: "0px 0px 300px 0px",
    threshold: 1.0
})

const personalFavs = async(movie_id) => {
    const favsUrl = `https://api.themoviedb.org/3/movie/${movie_id}`;
    
    const res = await fetch(`${favsUrl}?api_key=${API_KEY}`);
    const data = await res.json();
    movieLoader(data)
}


const trendingMovies = async() => {
    const trendingUrl = `trending/movie/week?page=${currentPage}`;
    
    const { data } = await api(trendingUrl);

    data.results.forEach(item => movieLoader(item))
    
    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);
}

const topMovies = async() => {
    const topRatedEndpoint = `movie/top_rated?page=${currentPage}`;
    
    const { data } = await api(topRatedEndpoint);

    data.results.forEach(item => movieLoader(item))

    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);
}

const movieLoader = (item) => {
    item.release_date = item.release_date.slice(0,4)
    
    movies += `
        <article class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" />
            <a class="modal-anchor" href="/movieView.html#${item.id}">
                <div class="description" id="description">
                    <p class="year">${item.release_date}</p>
                    <h3 class="movie-title">${item.title}</h3>
                    <p class="average">${item.vote_average.toFixed(1)}</p>
                </div>
            </a>
        </article>
    `;
    document.getElementById("movies-grid-container").innerHTML = movies;
}

const searchMovie = async(query) => {
    const searchEndpoint = `search/movie?page=${currentPage}`;
    movies = "";
    location.hash = `#search=${query.replace(/\s/g, "-")}`;

    const res  = await api.get(searchEndpoint, {
        params: {
            query,
        }
    });

    if(res.status !== 200){
        console.log("Error")
        gridTitle.innerText = "Network Error. Try again later"
    } else {
        res.data.results.forEach(movie => {
            movieDetailedView(movie.id);
        })
        gridTitle.innerText = "Search"
    }

    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);
}

const movieDetailedView = async(movie_id) => {
    const idSearchUrl = `movie/${movie_id}`;
    
    const { data } = await api.get(idSearchUrl);
    
    movieLoader(data)
}

(async() => {
    const genreListEndpoint = `genre/movie/list`;

    const { data } = await api.get(genreListEndpoint);
    
    data.genres.forEach(item => {
        const category = `<option id="${item.name}">${item.name}</option>`;
        dropdown.innerHTML += category;
        genreArray.push(item.name, item.id);
    })
})()    //IIFE - Inmediately Invoked

const getMoviesByGenre = async(id) => {
    const sortByGenreEndpoint = `discover/movie?page=${currentPage}`;

    const { data } = await api.get(sortByGenreEndpoint, {
        params: {
            with_genres: id,
        }
    })
    data.results.forEach(item => movieLoader(item))

    const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie);

}

// LISTENERS
searchBtn.addEventListener("click", () => {
    movies = "";
    searchMovie(searchInput.value)
})

window.addEventListener("DOMContentLoaded", () => {
    favoritesMoviesIds.forEach(item => personalFavs(item))
})

window.addEventListener("DOMContentLoaded", function() { 
    dropdown.addEventListener("change", function() {

      switch(this.value) {
        case "Trending":
            movies = "";
            currentPage = 1;
            trendingMovies();
            gridTitle.innerText = "Trending Movies"
            location.hash = "trending"
            break;
        case "Top-rated":
            movies = "";
            currentPage = 1;
            topMovies();
            gridTitle.innerText = "Top-rated Movies"
            location.hash = "top-rated"
            break;
        default:
            movies = "";
            let genreID = genreArray[genreArray.findIndex((genre) => genre === this.value) + 1];
            location.hash = `${this.value}-${genreID}`;
            gridTitle.innerText = this.value;

            getMoviesByGenre(genreID)
            break;
      }
    })
})
