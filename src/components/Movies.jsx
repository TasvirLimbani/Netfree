import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import Style from './Banner.module.css';
import Slider from 'react-slick';
import GenreSection from './GenreSection';
import Lottie from 'lottie-react';
import lotiiejsonfile from '../assetse/loading.json'
import { Link } from 'react-router-dom';

const Movies = ({ homeApi }) => {
  const [slidData, setSlidData] = useState(null);
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    if (!homeApi) return; // ✅ IMPORTANT: wait until homeApi is loaded

    fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(`${homeApi}?p=movie`))
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.");
      })
      .then(data => {
        const parsed = JSON.parse(data.contents);
        const post = parsed.post;
        const cleaned = post.map((item) => ({
          title: item.cate,
          movieIds: item.ids.split(","),
        }));

        const sldta = parsed.slider;
        setSlidData(sldta);
        setGenreData(cleaned);
      })
      .catch(error => console.error("Fetch error:", error));
  }, [homeApi]); // ✅ Depend on homeApi

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
  };

  if (!slidData) {
    return <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' } }>
      <Lottie animationData={ lotiiejsonfile } style={ { height: '100px' } } loop={ true } />
    </div>;;
  }

  return (
    <>
      <NavBar />

      <div className={ Style.BanMain }>
        <Slider { ...settings }>
          { slidData.map((movie, index) => (
            <Link to={ `/movie/${movie.id}` } className={ Style.sliderWrapper } key={ movie.id || index }>
              <header
                className={ `${Style.banner} ${index === 1 ? Style.bannerSecond : ''}` }
                style={ {
                  backgroundImage: `url("${movie.img}")`,
                } }
              >
                <div className={ Style.content }>
                  <img className={ Style.logo } src={ movie.namelogo } alt="Movie Logo" />
                  <p className={ Style.description }>{ movie.desc }</p>
                </div>
                <div className={ Style.fadeBottom } />
              </header>
            </Link>
          )) }
        </Slider>
      </div>

      <div>
        { genreData.map((genre, index) => (
          <GenreSection
            key={ index }
            title={ genre.title }
            movieIds={ genre.movieIds }
          />
        )) }
      </div>
    </>
  )
}

export default Movies