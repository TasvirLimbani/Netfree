// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Style from './MovieDetail.module.css';
// import GenreSection from './GenreSection';
// // import AuthModal from './AuthModal.jsx';

// const MovieDetail = () => {
//     const [movieApi, setMovieApi] = useState('');
//     const [episodeApi, setEpisodeApi] = useState('');

//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [movieDetail, setMovieDetail] = useState(null);
//     const [genreDataSg, setGenreDataSg] = useState(null);

//     const [seasons, setSeasons] = useState([]);
//     const [selectedSeasonId, setSelectedSeasonId] = useState(null);
//     const [episodes, setEpisodes] = useState([]);

//     // Load APIs from localStorage and set the state
//     useEffect(() => {
//         const apis = JSON.parse(localStorage.getItem('apis'));
//         if (apis) {
//             setMovieApi(apis.DetailsApi); // Set the movie API URL
//             setEpisodeApi(apis.EpisodeApi); // Set the episode API URL

//         } else {
//             console.error("No APIs found in localStorage.");
//         }
//     }, []); // Empty dependency array ensures this runs only once on mount

//     // Fetch movie details when movieApi and id are available
//     useEffect(() => {
//         if (!movieApi || !id) return; // If movieApi or id is not available, do not fetch

//         const detailUrl = `${movieApi}?id=${id}`;
//         const wrappedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(detailUrl)}`;

//         fetch(wrappedUrl)
//             .then((res) => {
//                 if (res.ok) return res.json();
//                 throw new Error('Network response was not ok.');
//             })
//             .then((data) => {
//                 const parsed = JSON.parse(data.contents);
//                 setMovieDetail(parsed);
//                 const ids = parsed.suggest.map(item => item.id);
//                 setGenreDataSg(ids);

//                 if (parsed.season) {
//                     setSeasons(parsed.season);
//                     setSelectedSeasonId(parsed.season[0]?.id); // Default to first season
//                 }
//             })
//             .catch((err) => console.error('Error fetching movie details:', err));
//     }, [movieApi, id]); // Fetch movie details when movieApi or id changes

//     // Fetch episodes when selectedSeasonId is available
//     useEffect(() => {
//         if (!selectedSeasonId || !episodeApi) return; // Ensure episodeApi and selectedSeasonId are available

//         const epUrl = `${episodeApi}?s=${selectedSeasonId}&series=${id}`;
//         const wrappedEpUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(epUrl)}`;

//         fetch(wrappedEpUrl)
//             .then((res) => res.ok ? res.json() : Promise.reject('Episode fetch failed'))
//             .then((data) => {
//                 const parsed = JSON.parse(data.contents);
//                 setEpisodes(parsed.episodes);
//             })
//             .catch((err) => console.error('Error fetching episodes:', err));
//     }, [selectedSeasonId, id, episodeApi]); // Fetch episodes when selectedSeasonId or episodeApi changes

//     const handlePlay = () => {
//         navigate("/watch", { state: { id } });
//     };

//     if (!movieDetail) return <div>Loading...</div>;

//     return (
//         <>
//             <div className={ Style.transNav }>
//                 <img src="/assets/images/Netflix_2015_logo.svg" alt="Netflix Logo" />
//             </div>
//             <div className={ Style.main }>
//                 <img src={ `https://imgcdn.media/pv/1080/${id}.jpg` } alt="" />
//                 <div className={ Style.bannerShade }>
//                     <div className={ Style.bannerDetail }>
//                         <h1 className={ Style.title }>{ movieDetail.title }</h1>
//                         <div className={ Style.meta }>
//                             <span>{ movieDetail.match }% Match</span>
//                             <span>{ movieDetail.year }</span>
//                             <span>{ movieDetail.ua }</span>
//                             <span>{ movieDetail.runtime }</span>
//                         </div>
//                         <p className={ Style.topDesc }>{ movieDetail.desc }</p>
//                         <button className={ `${Style.button} ${Style.playButton}` }
//                             onClick={ handlePlay }
//                         >▶ Play</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom details below the banner */ }
//             <div className={ Style.bottomDetails }>
//                 <div className={ Style.details }>
//                     <h2>Cast:</h2>
//                     <div className={ Style.castBox }>
//                         { movieDetail?.cast?.split(',').map((name, index) => (
//                             <span key={ index } className={ Style.castName }>
//                                 { name.trim() }
//                             </span>
//                         )) }
//                     </div>
//                     <hr />
//                     <h2>Genre:</h2>
//                     <div className={ Style.castBox }>
//                         { movieDetail?.genre?.split(',').map((name, index) => (
//                             <span key={ index } className={ Style.castName }>
//                                 { name.trim() }
//                             </span>
//                         )) }
//                     </div>
//                     <hr />
//                     <h2>Languages:</h2>
//                     <div className={ Style.castBox }>
//                         { movieDetail?.lang?.map((item, index) => (
//                             <span key={ index } className={ Style.castName }>
//                                 { item.l }
//                             </span>
//                         )) }
//                     </div>
//                 </div>

//                 { seasons.length > 0 && (
//                     <select
//                         className={ Style.season_select }
//                         value={ selectedSeasonId }
//                         onChange={ (e) => setSelectedSeasonId(e.target.value) }
//                     >
//                         { seasons.map((season) => (
//                             <option key={ season.id } value={ season.id }>
//                                 Season { season.s }
//                             </option>
//                         )) }
//                     </select>
//                 ) }

//                 <div className={ Style.epList }>
//                     { episodes.map((ep) => (
//                         <div className={ Style.epRow } key={ ep.id }>
//                             <div className={ Style.epImg }>
//                                 <img src={ `https://imgcdn.media/pv/720/${ep.id}.jpg` } alt="" />
//                             </div>
//                             <div className={ Style.epDetail }>
//                                 <h3>{ ep.s } { ep.ep }</h3>
//                                 <h4> { ep.t } <span className={ Style.epTime }>({ ep.time })</span></h4>
//                                 <p className={ Style.epDescrip }>{ ep.ep_desc }</p>
//                                 <div style={ { display: 'flex', alignItems: 'center' } }>
//                                     <svg style={ { color: 'rgb(26 152 255)', marginRight: '7px', marginTop: '10px' } } stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="text-[#1a98ff] w-[15px] h-[15px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>
//                                     <p className={ Style.epVerify }>
//                                         Included with Prime Video</p>
//                                 </div>
//                             </div>
//                             <div className={ Style.epBtn }>
//                                 <button>▶ Play Now</button>
//                             </div>
//                         </div>
//                     )) }
//                 </div>

//                 <h2 className={ Style.sugMovie }>Suggested Movies:</h2>
//                 <div style={ { marginLeft: '-40px', marginTop: '0' } }>
//                     <GenreSection movieIds={ genreDataSg } />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default MovieDetail;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Style from "./MovieDetail.module.css";
import GenreSection from "./GenreSection";

const MovieDetail = () => {
  const [movieApi, setMovieApi] = useState("");
  const [episodeApi, setEpisodeApi] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetail, setMovieDetail] = useState(null);
  const [genreDataSg, setGenreDataSg] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  // Load APIs from localStorage and set the state
  useEffect(() => {
    const apis = JSON.parse(localStorage.getItem("apis"));
    if (apis) {
      setMovieApi(apis.DetailsApi); // Set the movie API URL
      setEpisodeApi(apis.EpisodeApi); // Set the episode API URL
    } else {
      console.error("No APIs found in localStorage.");
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch movie details when movieApi and id are available
  useEffect(() => {
    if (!movieApi || !id) return; // If movieApi or id is not available, do not fetch

    const detailUrl = `${movieApi}?id=${id}`;
    const wrappedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      detailUrl
    )}`;

    fetch(wrappedUrl)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        setMovieDetail(parsed);
        const ids = parsed.suggest.map((item) => item.id);
        setGenreDataSg(ids);

        if (parsed.season) {
          setSeasons(parsed.season);
          setSelectedSeasonId(parsed.season[0]?.id); // Default to first season
        }
      })
      .catch((err) => console.error("Error fetching movie details:", err));
  }, [movieApi, id]); // Fetch movie details when movieApi or id changes

  // Fetch episodes when selectedSeasonId is available
  useEffect(() => {
    if (!selectedSeasonId || !episodeApi) return; // Ensure episodeApi and selectedSeasonId are available

    const epUrl = `${episodeApi}?s=${selectedSeasonId}&series=${id}`;
    const wrappedEpUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      epUrl
    )}`;

    fetch(wrappedEpUrl)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Episode fetch failed")
      )
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        setEpisodes(parsed.episodes);
      })
      .catch((err) => console.error("Error fetching episodes:", err));
  }, [selectedSeasonId, id, episodeApi]); // Fetch episodes when selectedSeasonId or episodeApi changes

  // Handle Play button click: navigate based on movie or series type
  const handlePlay = () => {
    if (!movieDetail) return;

    // Check if it's a series or movie based on data (assuming the 'type' field is in the API response)
    if (movieDetail.type === "m") {
      // Navigate to movie player page
      navigate(`/watch`, { state: { id } }); // For movie, navigate to /watch
    } else if (movieDetail.type === "t") {
      // For series, navigate to /series page with state containing season and episode info
      navigate(`/series`, {
        state: {
          id,
          season: selectedSeasonId,
          episode: episodes[0]?.id, // Pass the first episode's ID to the Series player
        },
      });
    }
  };

  if (!movieDetail) return <div>Loading...</div>;

  return (
    <>
      <div className={Style.transNav}>
        <img src="/assets/images/Netflix_2015_logo.svg" alt="Netflix Logo" />
      </div>
      <div className={Style.main}>
        <img src={`https://imgcdn.media/pv/c/${id}.jpg`} alt="" />
        <div className={Style.bannerShade}>
          <div className={Style.bannerDetail}>
            <h1 className={Style.title}>{movieDetail.title}</h1>
            <div className={Style.meta}>
              <span>{movieDetail.match}% Match</span>
              <span>{movieDetail.year}</span>
              <span>{movieDetail.ua}</span>
              <span>{movieDetail.runtime}</span>
            </div>
            <p className={Style.topDesc}>{movieDetail.desc}</p>
            <button
              className={`${Style.button} ${Style.playButton}`}
              onClick={handlePlay} // Play button now correctly calls handlePlay
            >
              ▶ Play
            </button>
          </div>
        </div>
      </div>

      {/* Bottom details below the banner */}
      <div className={Style.bottomDetails}>
        <div className={Style.details}>
          <h2>Cast:</h2>
          <div className={Style.castBox}>
            {movieDetail?.cast?.split(",").map((name, index) => (
              <span key={index} className={Style.castName}>
                {name.trim()}
              </span>
            ))}
          </div>
          <hr />
          <h2>Genre:</h2>
          <div className={Style.castBox}>
            {movieDetail?.genre?.split(",").map((name, index) => (
              <span key={index} className={Style.castName}>
                {name.trim()}
              </span>
            ))}
          </div>
          <hr />
          <h2>Languages:</h2>
          <div className={Style.castBox}>
            {movieDetail?.lang?.map((item, index) => (
              <span key={index} className={Style.castName}>
                {item.l}
              </span>
            ))}
          </div>
        </div>

        {seasons.length > 0 && (
          <select
            className={Style.season_select}
            value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                Season {season.s}
              </option>
            ))}
          </select>
        )}

        <div className={Style.epList}>
          {episodes.map((ep) => (
            <div className={Style.epRow} key={ep.id}>
              <div className={Style.epImg}>
                <img src={`https://imgcdn.media/pv/720/${ep.id}.jpg`} alt="" />
              </div>
              <div className={Style.epDetail}>
                <h3>
                  {ep.s} {ep.ep}
                </h3>
                <h4>
                  {ep.t} <span className={Style.epTime}>({ep.time})</span>
                </h4>
                <p className={Style.epDescrip}>{ep.ep_desc}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg
                    style={{
                      color: "rgb(26 152 255)",
                      marginRight: "7px",
                      marginTop: "10px",
                    }}
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="text-[#1a98ff] w-[15px] h-[15px]"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                  </svg>
                  <p className={Style.epVerify}>Included with Prime Video</p>
                </div>
              </div>
              <div className={Style.epBtn}>
                <button>▶ Play Now</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "0" }}>
          <h2>Suggested :</h2>
          <GenreSection movieIds={genreDataSg} />
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
