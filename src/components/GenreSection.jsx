import React, { useEffect, useState } from 'react'
import Style from './GenreSection.module.css'
import { Link } from 'react-router-dom';

const GenreSection = ({ title, movieIds }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const movieDetails = movieIds.map((id) => ({
                id,
                image: `https://imgcdn.kim/pv/341/${id}.jpg`,
            }));
            setMovies(movieDetails);
        };

        fetchMovies();
    }, [movieIds]);
    return (
        <>
            <div className={ Style.section }>
                <h2 className={ Style.title }>{ title }</h2>
                <div className={ Style.slider }>
                    { movies.map((movie) => (
                        <Link to={ `/movie/${movie.id}` } key={ movie.id }>
                            <img
                                key={ movie.id }
                                src={ movie.image }
                                alt=""
                                className={ Style.moviePoster }
                            />
                        </Link>
                    )) }
                </div>
            </div>
        </>
    )
}

export default GenreSection