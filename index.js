
const movieListElement = document.querySelector(".movie__list");
const searchBar = document.querySelector("#searchBar");

function openMenu() {
    document.body.classList.add('menu--open');
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

async function onSearch() {
    document.querySelector("#spinner").classList.add("movie__list--loading");
    await new Promise(time => setTimeout(time, 1000));
    const searchTitle = searchBar.value;
    const searchYear = document.getElementById('searchYear').value;
    var searchKey = "s=" + searchTitle + "&type=movie";
    if (searchYear) searchKey += ("&y=" + searchYear);
    if (searchTitle) {
        try {
            const movies = await fetch("https://www.omdbapi.com/?apikey=8097d20a&" + searchKey);
            const moviesData = await movies.json();
            
            document.querySelector("#spinner").classList.remove("movie__list--loading");
            if (moviesData.Search.length > 6) moviesData.Search.length = 6;
            
            
            // if ((Array.isArray(moviesData.Search)) && (moviesData.Search.length > 1)) {
            if (Array.isArray(moviesData.Search)) {
                movieListElement.innerHTML = moviesData.Search.map((movie) => movieHTML(movie)).join("");
            
            } else {
                movieListElement.innerHTML = "<p>No results found.</p>";
            }
        }
        catch (error) {
            movieListElement.innerHTML = "<p>Database not connected. Try again later.</p>";
        }
    } else alert("Title is required to search");   
}

function movieHTML(movie) {
    return `
            <div class="movie__box">
                <img src="${movie.Poster}" class="movie__poster"></img>
                <h2 class="movie__title">${movie.Title}</h2>
                <p>Year: ${movie.Year}</p>
            </div>
            `;
}


// function movieHTMLSingle(movie) { 
//     return `
//             <div class="movie__box">
//                 <img src="${movie.Poster}" class="movie__poster"></img>
//                 <h2 class="movie__title">${movie.Title}</h2>
//                 <p>Year: ${movie.Year}</p>
//                 <p>Rating: ${movie.Rated || "N/A"}</p>
//                 <p>Length: ${movie.Runtime || "N/A"}</p>
//                 <p class="movie__plot">Plot: ${movie.Plot || "N/A"}</p>
//             </div>
//             `;
// }

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
