import Slider from 'react-slick';
import React, { useEffect, useState } from 'react';
import Style from './Banner.module.css';


const Banner = ({ homeApi }) => {
    const [slidData, setSlidData] = useState(null);

    useEffect(() => {
        if (!homeApi) return; // ✅ IMPORTANT: wait until homeApi is loaded

        fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(homeApi))
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then(data => {
                const parsed = JSON.parse(data.contents);
                const sldta = parsed.slider;
                setSlidData(sldta);
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
        return <div>Loading...</div>;
    }

    return (
        <div className={ Style.BanMain }>
            <Slider { ...settings }>
                { slidData.map((movie, index) => (
                    <div className={ Style.sliderWrapper } key={ movie.id || index }>
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
                    </div>
                )) }
            </Slider>
        </div>
    );
};

export default Banner;
