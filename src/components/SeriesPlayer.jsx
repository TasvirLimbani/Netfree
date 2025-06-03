import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Style from './Movieplay.module.css';

function SeriesPlayer() {
    const location = useLocation();
    const { id, languages = [] } = location.state || {};

    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [hls, setHls] = useState(null);
    const [isVideoPaused, setIsVideoPaused] = useState(true);
    const [showHoverButton, setShowHoverButton] = useState(false);

    const qualities = [1080, 720, 480];
    const hideButtonTimeout = useRef(null);

    const hasAudio = Array.isArray(languages) && languages.length > 1;

    const [selectedLangIndex, setSelectedLangIndex] = useState(() => {
        const storedLang = sessionStorage.getItem("selectedLangIndex");
        return storedLang !== null ? Number(storedLang) : 0;
    });

    const handleLangChange = (e) => {
        const index = Number(e.target.value);
        setSelectedLangIndex(index);
        sessionStorage.setItem("selectedLangIndex", index);
    };

    const getSourceUrl = (quality) => {
        return `https://s10.nm-cdn2.top/files/${id}/${quality}p/-${quality}p.m3u8`;
    };

    const initHLS = (videoUrl, resumeTime = 0, shouldAutoplay = false) => {
        const video = videoRef.current;

        if (hls) hls.destroy();

        const newHls = new Hls();
        newHls.loadSource(videoUrl);
        newHls.attachMedia(video);

        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.currentTime = resumeTime;
            if (shouldAutoplay) {
                video.play().catch(() => { });
            }
        });

        setHls(newHls);
    };

    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        const defaultQuality = 720;
        const source = getSourceUrl(defaultQuality);

        const isFirstVisit = !sessionStorage.getItem("visited");
        sessionStorage.setItem("visited", "true");

        const syncAudioWithVideo = () => {
            if (hasAudio && audio && Math.abs(video.currentTime - audio.currentTime) > 0.3) {
                audio.currentTime = video.currentTime;
            }
        };

        const syncEvents = () => {
            video.addEventListener("play", () => {
                setIsVideoPaused(false);
                if (hasAudio && audio) {
                    audio.play().catch(() => { });
                }
            });

            video.addEventListener("pause", () => {
                setIsVideoPaused(true);
                if (hasAudio && audio) audio.pause();
            });

            video.addEventListener("seeking", () => {
                if (hasAudio && audio) audio.currentTime = video.currentTime;
            });

            video.addEventListener("timeupdate", syncAudioWithVideo);
        };

        const initPlyr = () => {
            const newPlayer = new Plyr(video, {
                fullscreen: {
                    enabled: true,
                    fallback: true,
                    allowFullscreen: true,
                },
                controls: [
                    "play-large", "play", "progress", "current-time", "mute", "volume",
                    "captions", "settings", "pip", "airplay", "fullscreen",
                ],
                settings: ["quality", "speed"],
                quality: {
                    default: defaultQuality,
                    options: qualities,
                    forced: true,
                    onChange: (newQuality) => {
                        const currentTime = video.currentTime;
                        const newSource = getSourceUrl(newQuality);
                        initHLS(newSource, currentTime, false);
                    },
                },
                speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
                tooltips: { controls: true, seek: true },
            });

            setPlayer(newPlayer);

            const style = document.createElement("style");
            style.innerHTML = `
        .plyr {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: black !important;
        }
        .plyr__video-wrapper {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 16/9;
          max-height: 100vh;
        }
        .plyr video {
          width: 100% !important;
          height: auto !important;
          max-height: 100%;
        }
      `;
            document.head.appendChild(style);
        };

        if (Hls.isSupported()) {
            initHLS(source, 0, isFirstVisit);
        }

        initPlyr();
        syncEvents();
    }, [id]);

    // LOAD AUDIO ON LANGUAGE CHANGE — only attach, don't autoplay
    useEffect(() => {
        if (!hasAudio || !audioRef.current || !videoRef.current) return;

        const audio = audioRef.current;
        const video = videoRef.current;

        const newAudioUrl = `https://s10.nm-cdn2.top/files/${id}/a/${selectedLangIndex}/${selectedLangIndex}.m3u8`;

        const audioHls = new Hls();

        audio.pause();
        audio.currentTime = 0;

        audioHls.loadSource(newAudioUrl);
        audioHls.attachMedia(audio);

        const onParsed = () => {
            audio.currentTime = video.currentTime;

            const syncAndPlay = () => {
                audio.currentTime = video.currentTime;
                audio.play().catch(() => { });
                video.removeEventListener("play", syncAndPlay);
            };

            if (!video.paused) {
                syncAndPlay();
            } else {
                video.addEventListener("play", syncAndPlay);
            }
        };

        audioHls.on(Hls.Events.MANIFEST_PARSED, onParsed);

        return () => {
            audio.pause();
            audioHls.destroy();
        };
    }, [selectedLangIndex, id]);

    const handleMouseMove = () => {
        setShowHoverButton(true);
        if (hideButtonTimeout.current) clearTimeout(hideButtonTimeout.current);
        if (!isVideoPaused) {
            hideButtonTimeout.current = setTimeout(() => {
                setShowHoverButton(false);
            }, 2000);
        }
    };

    return (
        <div className={ Style.movieMain } onMouseMove={ handleMouseMove }>
            <video
                ref={ videoRef }
                controls
                playsInline
                style={ { width: "100%", height: "100%", aspectRatio: "16/9" } }
            />
            { hasAudio && <audio ref={ audioRef } style={ { display: "none" } } /> }

            { languages.length > 0 && (
                <div
                    className={ `${Style.langSelectWrapper} ${showHoverButton || isVideoPaused ? Style.langSelectVisible : ""
                        }` }
                >
                    <select
                        value={ selectedLangIndex }
                        onChange={ handleLangChange }
                        className={ Style.selectBox }
                    >
                        { languages.map((lang, index) => (
                            <option key={ index } value={ index }>
                                { lang.l }
                            </option>
                        )) }
                    </select>
                </div>
            ) }
        </div>
    );
}

export default SeriesPlayer;

