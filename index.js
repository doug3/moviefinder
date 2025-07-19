
const movieListElement = document.querySelector(".movie__list");
const searchBar = document.querySelector("#searchBar");

function openMenu() {
    document.body.classList.add('menu--open');
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

async function onSearch() {
    
    const searchTitle = searchBar.value;
    const searchYear = document.getElementById('searchYear').value;
    var searchKey = "s=" + searchTitle + "&type=movie";
    if (searchYear) searchKey += ("&y=" + searchYear);
    if (searchTitle) {
        try {
            const movies = await fetch("https://www.omdbapi.com/?apikey=8097d20a&" + searchKey);
            const moviesData = await movies.json();

            if (moviesData.Search.length > 6) moviesData.Search.length = 6;
            
            
            // if ((Array.isArray(moviesData.Search)) && (moviesData.Search.length > 1)) {
            if (Array.isArray(moviesData.Search)) {
                movieListElement.innerHTML = moviesData.Search.map((movie) => movieHTML(movie)).join("");

            // } else if (moviesData.Search.length == 1) {
            //     movieListElement.innerHTML = movieHTMLsingle(moviesData);
            
            } else {
                movieListElement.innerHTML = "<p>No results found.</p>";
            }
        }
        catch (error) {
            console.log("There was a problem!! Try again.");
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
//     console.log(movie);
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
    console.log(event.code);
    if ((event.code === "Enter") || (event.code === "NumpadEnter")) {
        event.preventDefault();
        onSearch();
    }
});
