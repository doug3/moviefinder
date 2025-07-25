
const movieListElement = document.querySelector(".movie__list");
const searchBarText = document.querySelector("#searchBar");
const searchBarYear = document.getElementById('searchYear');
const resultsTerm = document.getElementById("searchTerm");
const resultsHeader = document.getElementById("resultsHeader");

const rangeInput = document.querySelectorAll(".range__input input"),
      yearInput = document.querySelectorAll(".year__input input"),
      range = document.querySelector(".slider .progress");
var yearGap = 1;

var movieSingles;

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

yearInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minYear = parseInt(yearInput[0].value),
        maxYear = parseInt(yearInput[1].value);
        if (minYear < 1900) {
            minYear = 1900;
        }
        if (minYear > maxYear) {
            minYear = maxYear - yearGap;
        };
        if ((maxYear - minYear >= yearGap) && maxYear <= rangeInput[1].max){
            if (e.target.className === "input__min") {
                rangeInput[0].value = minYear;
                range.style.left  = ((minYear - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
            } else {
                rangeInput[1].value = maxYear;
                range.style.right = 100 - ((maxYear - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
            }
        }
        generateResultsCode(movieSingles);
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);
        if ((maxVal - minVal) < yearGap) {
            if (e.target.className === "range__min") {
                rangeInput[0].value = maxVal - yearGap
            } else {
                rangeInput[1].value = minVal + yearGap;
            }
        } else {
            yearInput[0].value = minVal;
            yearInput[1].value = maxVal;
            range.style.left = (((minVal - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100) + "%";
            range.style.right = 100 - ((maxVal - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
        }
        generateResultsCode(movieSingles);
    });
});


function openMenu() {
    document.body.classList.add('menu--open');
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

async function onSearch() {
    movieSingles = [];
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
                moviesArray = moviesData.Search;
                movieSingles = await moviesDetail(moviesArray);
                generateResultsCode(movieSingles);
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
                try {
                    movieSingle = await fetch("https://www.omdbapi.com/?apikey=8097d20a&t=" + moviesArray[i].Title);
                    movieSingleArray[i] = await movieSingle.json();
                }
                catch (error) {
                    alert("Database Error. Please try again.");
                }
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



function generateResultsCode(movieArray) {
    const arrLen = movieArray.length;
    let newHTML = [];
    for (let i = 0, j = 0; ((i < arrLen) && j < 6); i++) {
        if (parseInt(movieArray[i].Year)) {
            if ((movieArray[i].Year >= rangeInput[0].value) && (movieArray[i].Year <= rangeInput[1].value)) {
                newHTML[j] = movieHTML(movieArray[i]);
                j++;
            }
        };
    };
    movieListElement.innerHTML = newHTML.join("");
}


