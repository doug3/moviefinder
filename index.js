
const movieListElement = document.querySelector(".movie__list");
const searchBarText = document.querySelector("#searchBar");
const searchBarYear = document.getElementById('searchYear');
const resultsTerm = document.getElementById("searchTerm");
const resultsHeader = document.getElementById("resultsHeader");

document.addEventListener('DOMContentLoaded', () => {
    movieListElement.addEventListener('error', function (e) {
        if (e.target.classList.contains('movie__poster')) {
            e.target.src = './assets/unavailable.png';
        }
    }, true);
});

searchBar.addEventListener("keyup", function(event) {
    if ((event.code === "Enter") || (event.code === "NumpadEnter")) {
        event.preventDefault();
        onSearch();
    }
});

function openMenu() {
    document.body.classList.add('menu--open');
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

async function onSearch() {
    movieListElement.innerHTML = "";
    document.querySelector("#spinner").classList.add("movie__list--loading");
    resultsHeader.classList.remove("results__header--off");
    await new Promise(time => setTimeout(time, 1000));
    const searchTitle = searchBarText.value;
    const searchYear = searchBarYear.value;
    var searchKey = "s=" + searchTitle + "&type=movie";
    searchBarText.value = "";
    searchBarYear.value = "";

    resultsTerm.innerHTML = searchTitle;
    if (searchYear) {
        searchKey += ("&y=" + searchYear);
        resultsTerm.innerHTML += (" " + searchYear);
    }

    if (searchTitle) {
        try {
            var moviesArray;
            const movies = await fetch("https://www.omdbapi.com/?apikey=8097d20a&" + searchKey);
            const moviesData = await movies.json();

            document.querySelector("#spinner").classList.remove("movie__list--loading");
            
            if (Array.isArray(moviesData.Search)) {
                if (moviesData.Search.length > 6) moviesData.Search.length = 6;
                moviesArray = moviesData.Search;
                const movieSingles = await moviesDetail(moviesArray);
                movieListElement.innerHTML = movieSingles.map((movie) => movieHTML(movie)).join("");
            
            } else {
                movieListElement.innerHTML = "<p class='results__none'>No results found.</p>";
            }
        }
        catch (error) {
            movieListElement.innerHTML = "<p>Database not connected. Try again later.</p>";
        }
    } else {
        document.querySelector("#spinner").classList.remove("movie__list--loading");
        alert("Title is required to search");
    }   
}

async function moviesDetail(moviesArray) {
            var movieSingle;
            var movieSingleArray = [];
            for (i = 0; i < moviesArray.length; i++) { 
                movieSingle = await fetch("https://www.omdbapi.com/?apikey=8097d20a&t=" + moviesArray[i].Title);
                movieSingleArray[i] = await movieSingle.json();
            };
            return movieSingleArray;
}

function movieHTML(movie) {
    return `
            <div class="movie__box--wrapper">    
                <div class="movie__box movie__show">
                    <figure class="movie__poster--wrapper">
                        <img src="${movie.Poster}" class="movie__poster">
                    </figure>
                    <div>
                        <h2 class="movie__title">${movie.Title}</h2>
                        <p class="movie__year">Year: ${movie.Year}</p>
                    </div>
                </div>
                <div class="movie__detail movie__hide">
                    <p><b>Rated:</b> ${movie.Rated}</p>
                    <p><b>Length:</b> ${movie.Runtime}</p>
                    <p><b>Director:</b> ${movie.Director}</p>
                    <p><b>Cast:</b> ${movie.Actors}</p>
                    <p><b>Plot:</b> ${movie.Plot}</p>
                </div>
            </div>
            `;
}

