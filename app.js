
const title = document.getElementById('title');
const poster = document.getElementById('poster');
const plot = document.getElementById('plot');
const filmSearch = document.getElementById('filmSearch');
const filmWrap = document.getElementById('filmWrap');
const libraryWrap = document.getElementById('libraryWrap');
const imdblink = document.getElementById('imdbLink');
const moviedblink = document.getElementById('theMovieDbLink');
const youtubelink = document.getElementById('youtubeLink');
const newFilmButton = document.getElementById('newFilm');
const saveFilmButton = document.getElementById('saveFilm');
const toggleButton1 = document.getElementById('toggle1');
const toggleButton2 = document.getElementById('toggle2');
const exportButton = document.getElementById('exportFilm');
const filmContainer = document.getElementById('filmContainer')
const streamingProviders = document.getElementById('streamingProviders')
const rentalProviders = document.getElementById('rentalProviders')

let latestFilm;
let currentFilmData;
let savedFilms = [];


getMovie()


function getMovie() {
    fetch(`https://randommovierailsapi-production.up.railway.app/api/films/random`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
        .then(res => {
            console.log(res)
            return res.json();
        })
        .then(data => {
            console.log(data)
            title.textContent = `${data.title} (${data.year})`;
            filmSearch.setAttribute('href', `https://www.google.com/search?q=${title.textContent.split(' ').join('+')}+film&tbm=vid`);
            imdblink.setAttribute('href', `https://www.imdb.com/title/${data.imdb_id}`);
            moviedblink.setAttribute('href', `https://www.themoviedb.org/movie/${data.id}`);
            youtubelink.setAttribute('href', data.youtube_link)
            poster.src = `https://image.tmdb.org/t/p/w300/${data.poster}`;
            poster.setAttribute('alt', `movie poster for ${title.textContent}`);
            plot.innerHTML = `${data.plot}`;
            if (data.streaming_providers === undefined) {
                streamingProviders.innerHTML = "none"

            } else {
                streamingProviders.innerHTML = `${data.streaming_providers.join(', ')}`
            }
            if (data.rental_providers === undefined) {
                rentalProviders.innerHTML = "none"
            } else {
                rentalProviders.innerHTML = `${data.rental_providers.join(', ')}`

            }
            currentFilmData = data;
        })
};


function downloadCSV() {
    ids = savedFilms.map(function (film) {
        return film.id;
    });

    let csvContent = "tmdbID, \n" + ids.join(", \n");

    let csvData = new Blob([csvContent], { type: 'text/csv' });
    let csvUrl = URL.createObjectURL(csvData);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = "SavedFilms" + '.csv';
    hiddenElement.click();
};

function switchContent() {
    if (libraryWrap.classList.contains('hide')) {
        filmWrap.classList.add('hide');
        libraryWrap.classList.remove('hide');
        if (savedFilms.length === 0) {
            noFilmsMessage = document.createElement('h2');
            noFilmsMessage.textContent = 'No Saved Films';
            libraryWrap.appendChild(noFilmsMessage);
        } else { showLibrary() }
    } else if (filmWrap.classList.contains('hide')) {
        libraryWrap.classList.add('hide');
        filmWrap.classList.remove('hide');
        removeAllChildNodes(filmContainer)
        noFilmsMessage.parentNode.removeChild(noFilmsMessage)
    };
};

function showLibrary() {
    savedFilms.forEach(function (object, index) {
        filmListItem = document.createElement('div')
        filmListItem.classList.add('filmItem')
        filmListItem.id = `film-${index + 1}`
        filmPoster = document.createElement('img')
        filmPoster.src = `https://image.tmdb.org/t/p/w300/${object.poster_path}`
        filmTitle = document.createElement('p')
        filmTitle.textContent = object.title
        deleteButton = document.createElement('button')
        deleteButton.innerHTML = 'Remove From List'
        deleteButton.addEventListener('click', function (e) {
            savedFilms.splice(index, 1);
            removeAllChildNodes(filmContainer);
            showLibrary();
        })
        filmListItem.appendChild(filmTitle)
        filmListItem.appendChild(filmPoster)
        filmListItem.appendChild(deleteButton)
        filmContainer.appendChild(filmListItem)
    }
    )

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


newFilmButton.addEventListener('click', function (e) { getMovie(latestFilm); });

saveFilmButton.addEventListener('click', function (e) { if (savedFilms.includes(currentFilmData) === false) savedFilms.unshift(currentFilmData) });

exportButton.addEventListener('click', function (e) { downloadCSV() });

toggleButton1.addEventListener('click', switchContent);

toggleButton2.addEventListener('click', switchContent);


