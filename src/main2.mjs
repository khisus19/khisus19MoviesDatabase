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
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
let currentPage = 1;
const trendingBtn = document.getElementById("tredingDropdown");
const topRatedBtn = document.getElementById("topRatedDropdown");

const searchBtn = document.getElementById("search-btn");
const gridTitle = document.getElementById("grid-title");

btnNext.addEventListener("click", () => {
    if (currentPage < 1000) {
        currentPage++;
        if(document.getElementById("sort-dropdown").value === "Trending") {
            trendingMovies()
        } else {
            topMovies()
        }
    }
})
btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        if(document.getElementById("genre-dropdown").value === "Trending") {
            trendingMovies()
        } else {
            topMovies()
        }
    }
})

const trendingMovies = async() => {
    movies = "";
    const trendingUrl = `trending/movie/week?page=${currentPage}`;
    
    const { data } = await api(trendingUrl)
    // console.log(data)

    data.results.forEach(item => movieLoader(item))
}

const topMovies = async() => {
    movies = "";
    const topRatedUrl = `movie/top_rated?page=${currentPage}`;
    
    const { data } = await api(topRatedUrl)
    // console.log(data)

    data.results.forEach(item => movieLoader(item))
}

const movieLoader = (item) => {
    movies += `
        <article class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" />
            <div class="description" id="description">
                <p class="year">${item.release_date.slice(0,4)}</p>
                <h3 class="movie-title">${item.title}</h3>
                <p class="average">${item.vote_average.toFixed(1)}</p>
            </div>
        </article>
    `;
    document.getElementById("movies-grid-container").innerHTML = movies;
}

trendingBtn.addEventListener("click", () => {
    currentPage = 1;
    trendingMovies()
    gridTitle.innerText = "Trending Movies"

})
topRatedBtn.addEventListener("click", () => {
    currentPage = 1;
    topMovies()
    gridTitle.innerText = "Top-rated Movies"

})


// if(document.getElementById("sort-dropdown").value === "Trending") {
//     trendingMovies()
// } else {
//     topMovies()
// }

const searchMovie = async(query) => {
    const searchEndpoint = "https://api.themoviedb.org/3/search/movie?";

    const { data } = await api(`${searchEndpoint}api_key=${API_KEY}&query=${query}`);
    data.results.forEach(movie => {
        movieLoader(movie)
    })
}

searchBtn.addEventListener("click", () => {
    const searchInput = document.getElementById("search-input");
    movies = "";
    searchMovie(searchInput.value)
})

trendingMovies()
