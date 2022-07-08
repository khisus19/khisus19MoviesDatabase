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
    try {
        const { data } = await api(trendingUrl);
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
        

    } catch {
        console.error("No se completo el fetch")
    }
}

loadMovies();

const loadGenre = async() => {
    const categoriesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

    try {
        const res = await fetch(categoriesUrl)

        if(res.status !== 200) {
            console.error(res.status, res.statusText)
        } else {
            const data = await res.json();
            console.log(data)

            data.genres.forEach(genre => {
                console.log(genre.id, genre.name)
            });
        }
    } catch {
        console.error("No se completo el fetch")
    }
}