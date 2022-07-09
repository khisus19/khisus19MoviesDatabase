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

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
let currentPage = 1;

btnNext.addEventListener("click", () => {
    if (currentPage < 1000) {
        currentPage++;
        loadMovies();
    }
})
btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadMovies();
    }
})

const loadMovies = async() => {
    const trendingUrl = `trending/movie/week?page=${currentPage}`;
    const topRatedUrl = `movie/top_rated?page=${currentPage}`;
    
    const { data } = await api(trendingUrl)
    console.log(data)

    let movies = "";
    data.results.forEach(movie => {
        movies += `
            <article class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" />
                <div class="description" id="description">
                    <p class="year">${movie.release_date.slice(0,4)}</p>
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="average">${movie.vote_average.toFixed(1)}</p>
                </div>
            </article>
        `;
    });
    document.getElementById("movies-grid-container").innerHTML = movies;
    
}

loadMovies();

const loadGenre = async() => {
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

    const { data } = await api(genreUrl);

    let dropdown = "";
    data.genres.forEach(genre => {
        dropdown += `
        <option>${genre.name}</option>`
    });
    document.getElementById("genre-dropdown").innerHTML += dropdown;
}
loadGenre()

const searchMovie = async(query) => {
    const searchEndpoint = "https://api.themoviedb.org/3/search/movie?";

    const { data } = await api(`${searchEndpoint}api_key=${API_KEY}&query=${query}`)
    console.log(data.results.length)
    /* data.results.forEach(movie => {
        console.log(movie.original_title)

    }) */
}
searchMovie("Thor")