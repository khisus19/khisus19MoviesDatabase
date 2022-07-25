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
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" onerror='this.src = "../assets/popcorn-no-poster.svg"'/>
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

    try {
        const res  = await api.get(searchEndpoint, {
            params: {
                query,
            }
        })

        if(res.status !== 200){
            console.log("Error")
            gridTitle.innerText = "Network Error. Try again later"
        } else {
            res.data.results.forEach(movie => {
                movieDetailedView(movie.id);
            })
            gridTitle.innerText = "Search"
        }
    } catch {
        ((error) => {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    /* const moviesOnScreen = document.querySelectorAll("#movies-grid-container .movie-card");
    let lastMovie = moviesOnScreen[moviesOnScreen.length - 1];
    observer.observe(lastMovie); */
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