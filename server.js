const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use (express.static('public')); 
app.use(express.urlencoded({ extended: true }));

app.get('/search', (req, res) => {
    res.render('search', { movieDetails:''});
});

app.post('/search', (req, res) => {
    let movieTitle = req.body.movieTitle;

    console.log (movieTitle);

    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=e0311f3f77cbf90171a1e025d2c61744&query=${movieTitle}`;
    let genresUrl ='https://api.themoviedb.org/3/genre/movie/list?api_key=e0311f3f77cbf90171a1e025d2c61744&language=en-US';

    let endpoint = [movieUrl, genresUrl];

    axios.all(endpoint.map((endpoint)=> axios.get(endpoint)))
        .then(axios.spread((movie, genres) => {

            const [movieRaw] = movie.data.results;
            let movieGenreId = movieRaw.genre_ids;
            let movieGenres = genres.data.genres;

            let movieGenresArray = [];

            let movieGenersArray = [];
                for(let i = 0; i < movieGenreId.length; i++) {
                    for(let j = 0; j < movieGenres.length; j++) {
                        if(movieGenreId[i] === movieGenres[j].id) {
                    movieGenersArray.push(movieGenres[j].name)
                    }             
                }
            }

    // console.log (movieGenersArray, movieGenreId, movieGenres, movieRaw);

            let genresToDisplay = '';
            movieGenersArray.forEach(genre => {
                genresToDisplay = genresToDisplay+ `${genre}, `;
            });

            genresToDisplay = genresToDisplay.slice(0, -2) + '.';

            let movieData  = {
                title: movieRaw.title,
                year: new Date(movieRaw.release_date).getFullYear(),
                genres: genresToDisplay,
                overview: movieRaw.overview,
                posterUrl: `https://image.tmdb.org/t/p/w500/${movieRaw.poster_path}`
            };
            res.render('search', {movieDetails: movieData});
        }));
}); 

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening port 3000')
}); 

