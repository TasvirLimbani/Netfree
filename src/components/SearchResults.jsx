import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Style from './SearchResults.module.css'

const SearchResults = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const results = state?.results || [];
    const fulldata = JSON.parse(results.contents);
    const fnlData = fulldata.searchResult;

    const scUrl = results.status.url;
    const urlObj = new URL(scUrl);
    const searchTerm = urlObj.searchParams.get('s'); // "rock"

    return (
        <>
            <h1 className={ Style.srcResult }>Search result for : <strong>{ searchTerm }</strong></h1>
            <h1 onClick={ () => navigate('/') } className={ Style.backHome }>&larr; back to Homepage</h1>
            <div className={ Style.resultBox }>
                { fnlData.length > 0 ? (
                    fnlData.map((item, index) => (
                        <div key={ index } onClick={ () => navigate(`/movie/${item.id}`) }>
                            <img
                                key={ item.id }
                                src={ `https://imgcdn.media/pv/720/${item.id}.jpg` }
                                alt=""
                                className={ Style.moviePoster }
                            />
                        </div>
                    ))
                ) : (
                    <p>No results found. 🙁</p>
                ) }
            </div>
        </>
    )
}

export default SearchResults