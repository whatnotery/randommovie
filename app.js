
const title = document.getElementById('title')
const poster = document.getElementById('poster')
const plot = document.getElementById('plot')
const filmSearch = document.getElementById('filmSearch')
const imdblink = document.getElementById('imdbLink');
const moviedblink = document.getElementById('theMovieDbLink');
const newFilmButton = document.getElementById('newFilm');
const saveFilmButton = document.getElementById('saveFilm')
const exportButton = document.getElementById('exportFilm')
let latestFilm
let currentFilmData 
let savedFilms = []

fetch('https://api.themoviedb.org/3/movie/latest?api_key=b07d3efad9e75e49c88e831539462c48')
    .then(res => {
        return res.json()
    })
    .then(data => {
        latestFilm = data.id
        return parseInt(data.id)
    })
   .then(data => {
        getMovie(data)
    })
    .catch(err => {
        console.log(err)
    });

    
function getMovie(lastMovieID) {
    let movieID = Math.floor(Math.random() * lastMovieID);
    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=b07d3efad9e75e49c88e831539462c48`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if (data.adult === true || !data.title || !data.poster_path || !data.overview) {
                console.log(data)
                getMovie(movieID)
            } else {
                title.textContent = `${data.title} (${data.release_date.slice(0,4)})`
                filmSearch.setAttribute('href',`https://www.google.com/search?q=${title.textContent.split(' ').join('+')}+film&tbm=vid`)
                imdblink.setAttribute('href',`https://www.imdb.com/title/${data.imdb_id}`)
                moviedblink.setAttribute('href',`https://www.themoviedb.org/movie/${data.id}`)
                poster.src = `https://image.tmdb.org/t/p/w300/${data.poster_path}`
                poster.setAttribute('alt', `movie poster for ${title.textContent}`)
                plot.innerHTML = `${data.overview}`
                currentFilmData = data
            }
        })
    }

    function downloadCSV() {
    ids = savedFilms.map( function (film) {
    return film.id
    })

    let csvContent = "tmdbID, \n" + ids.join(", \n")

    let csvData = new Blob([csvContent], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = "SavedFilms" + '.csv';
    hiddenElement.click();
            }



newFilmButton.addEventListener('click' , function (e) { getMovie(latestFilm); })

saveFilmButton.addEventListener('click' , function (e) {savedFilms.unshift(currentFilmData)} )

exportButton.addEventListener('click' , function (e) { downloadCSV()})
