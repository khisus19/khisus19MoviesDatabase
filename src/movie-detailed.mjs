import { API_KEY } from "./api_key.mjs";

let details = "";
let movieId = location.hash.slice(1,)

const movieDetailedView = async(movie_id) => {
    const idSearchUrl = `https://api.themoviedb.org/3/movie/${movie_id}`;
    
    const res = await fetch(`${idSearchUrl}?api_key=${API_KEY}`);
    const data = await res.json();
    
    let genre = data.genres.map(ele => ele.name).join(", ")
    details += `
    <div id="modal-card-${data.id}" class="movie-container">
        <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" />
        <div class="description-container" id="description">
            <p class="year">${data.release_date.slice(0,4)}</p>
            <p class="genre">${genre}</p>
            <h2 class="movie-title">${data.title}</h2>
            <p class="average">${data.vote_average.toFixed(1)}</p>
            <p class="tagline"><em>"${data.tagline}"</em></p>
            <p class="synopsis"><span>Synopsis: </span>${data.overview}</p>
            <p class="runtime"><span>Runtime: </span>${data.runtime} min.</p>
        </div>
    </div>
    `
    console.log(data)
    console.log(genre)
    document.getElementById("movie-view").innerHTML = details;
}
console.log("id:", movieId)
movieDetailedView(movieId)