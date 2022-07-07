import { API_KEY } from "./api_key.mjs";

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
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`);
        
        if(res.status !== 200) {
            console.error(res.status)
        } else {
            const data = await res.json();
            console.log(data)

            let movies = "";
            data.results.forEach(movie => {
                movies += `
                    <article class="movie-card">
                        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" />
                        <div class="description" id="description">
                            <p class="year">${movie.release_date.slice(0,4)}</p>
                            <h3 class="movie-title">${movie.title}</h3>
                            <p class="average">${movie.vote_average}</p>
                        </div>
                    </article>
                `;
            });
            document.getElementById("movies-grid-container").innerHTML = movies;
        }

    } catch {
        console.error("No se completo el fetch")
    }
}

loadMovies();