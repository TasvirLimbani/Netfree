// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import Style from './SeriesPlayer.module.css'
// import Hls from "hls.js"; // import hls.js

// const SeriesPlayer = () => {
//     const location = useLocation();
//     const { id } = location.state || {};

//     const audioRef = useRef(null);
//     const videoRef = useRef(null);

//     const [movieApi, setMovieApi] = useState(null);  // Default to null instead of an empty string
//     const [episodeApi, setEpisodeApi] = useState('');
//     const [seriesDetails, setSeriesDetails] = useState(null);
//     const [seasons, setSeasons] = useState([]);
//     const [selectedSeasonId, setSelectedSeasonId] = useState('');
//     const [episodes, setEpisodes] = useState([]);
//     const [canPlay, setCanPlay] = useState(false);


//     // const audioUrl = `https://s10.nm-cdn2.top/files/${id}/a/0/0.m3u8`;
//     // const videoUrl = `https://s10.nm-cdn2.top/files/${id}/720p/-720p.m3u8`;
//     useEffect(() => {
//         const apis = JSON.parse(localStorage.getItem('apis'));
//         if (apis) {
//             setMovieApi(apis.DetailsApi);  // Set the movie API URL
//             setEpisodeApi(apis.EpisodeApi);  // Set the episode API URL
//         } else {
//             console.error("No APIs found in localStorage.");
//         }
//     }, []);

//     useEffect(() => {
//         if (movieApi && id) {
//             console.log("Movie API URL:", movieApi);
//             console.log("Series ID:", id);

//             const detailUrl = `${movieApi}?id=${id}`;
//             const wrappedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(detailUrl)}`;
//             const fetchSeriesDetails = async () => {
//                 try {
//                     const response = await fetch(wrappedUrl);
//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch series details, status: ${response.status}`);
//                     }
//                     const data = await response.json();
//                     const fnldta = JSON.parse(data.contents)
//                     setSeriesDetails(fnldta);
//                     setSeasons(fnldta.season);
//                     if (fnldta.season?.[0]?.id) {
//                         setSelectedSeasonId(fnldta.season[0].id); // Auto-select first season
//                     }
//                 } catch (error) {
//                     console.error("Error fetching series details:", error);
//                 }
//             };

//             fetchSeriesDetails();
//         }
//     }, [movieApi, id]);

//     useEffect(() => {
//         if (selectedSeasonId && episodeApi) {
//             const epUrl = `${episodeApi}?s=${selectedSeasonId}&series=${id}`;
//             const wrappedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(epUrl)}`;

//             const fetchEpisodes = async () => {
//                 try {
//                     const response = await fetch(wrappedUrl);
//                     const data = await response.json();
//                     const epData = JSON.parse(data.contents);
//                     console.log(epData);
//                     setEpisodes(epData.episodes);
//                     // setEpisodes(epData);
//                 } catch (error) {
//                     console.error("Error fetching episodes:", error);
//                 }
//             };

//             fetchEpisodes();
//         }
//     }, [selectedSeasonId, episodeApi, id]);

//     const videoUrl = `https://s10.nm-cdn2.top/files/${episodes[0]["id"]}/720p/-720p.m3u8`;
//     useEffect(() => {
//         // Setup HLS for video
//         if (videoRef.current) {
//             if (Hls.isSupported()) {
//                 const hls = new Hls();
//                 hls.loadSource(videoUrl);
//                 hls.attachMedia(videoRef.current);
//             } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//                 videoRef.current.src = videoUrl;
//             }
//         }

//         // if (audioRef.current) {
//         //     if (Hls.isSupported()) {
//         //       const hlsAudio = new Hls();
//         //       hlsAudio.loadSource(audioUrl);
//         //       hlsAudio.attachMedia(audioRef.current);
//         //     } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         //       audioRef.current.src = audioUrl;
//         //     }
//         //   }
//     }, [videoUrl]);

//     useEffect(() => {
//         const handleLoadedMetadata = () => {
//             setCanPlay(true); // Set to true once the media is ready to play
//         };

//         if (videoRef.current && audioRef.current) {
//             videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
//             audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
//         }

//         return () => {
//             if (videoRef.current && audioRef.current) {
//                 videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
//                 audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
//             }
//         };
//     }, []);

//     return (
//         <>
//             {/* { seasons.length > 0 && (
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
//                                 <h4>{ ep.t } <span className={ Style.epTime }>({ ep.time })</span></h4>
//                                 <p className={ Style.epDescrip }>{ ep.ep_desc }</p>
//                                 <div style={ { display: 'flex', alignItems: 'center' } }>
//                                     <svg
//                                         style={ { color: 'rgb(26 152 255)', marginRight: '7px', marginTop: '10px' } }
//                                         stroke="currentColor"
//                                         fill="currentColor"
//                                         strokeWidth="0"
//                                         viewBox="0 0 512 512"
//                                         className="text-[#1a98ff] w-[15px] h-[15px]"
//                                         height="1em"
//                                         width="1em"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
//                                     </svg>
//                                     <p className={ Style.epVerify }>Included with Prime Video</p>
//                                 </div>
//                             </div>
//                             <div className={ Style.epBtn }>
//                                 <button>▶ Play Now</button>
//                             </div>
//                         </div>
//                     )) }
//                 </div>  */}
//             <div>
//                 <div style={ { width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
//                     <video
//                         ref={ videoRef }
//                         width="100%"
//                         height="auto"
//                         controls={ true }
//                         muted
//                     />
//                 </div>

//                 <div>
//                     <audio
//                         ref={ audioRef }
//                         controls={ false }
//                     />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SeriesPlayer;
