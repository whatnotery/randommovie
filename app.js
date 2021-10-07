
const title = document.querySelector('#title')
const poster = document.querySelector('#poster')
const plot = document.querySelector('#plot')
let dataID = 0

fetch('https://api.themoviedb.org/3/movie/latest?api_key=b07d3efad9e75e49c88e831539462c48')
    .then(res => {
        return res.json()
    })
    .then(data => {
        
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
                poster.src = `https://image.tmdb.org/t/p/w300/${data.poster_path}`
                plot.innerHTML = `${data.overview}`
            }
        })

}






