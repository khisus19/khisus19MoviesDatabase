// LISTENERS
searchBtn.addEventListener("click", (event) => {
    event.preventDefault()
    movies = "";
    searchMovie(searchInput.value)
})

window.addEventListener("DOMContentLoaded", () => {
    favoritesMoviesIds.forEach(item => personalFavs(item));
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
            currentPage++;
            searchMovie(searchInput.value);
        } else if(entrada.isIntersecting) {
            currentPage++;
            getMoviesByGenre(location.hash.split("-")[1])
            console.log(location.hash)
        } 
    })
}, {
    rootMargin: "0px 0px 300px 0px",
    threshold: 1.0
})