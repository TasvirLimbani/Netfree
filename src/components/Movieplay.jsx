// import React, { useRef, useState, useEffect } from "react";
// import Hls from "hls.js"; // import hls.js
// import { useLocation } from "react-router-dom";

// const MediaSyncPlayer = () => {
//   const location = useLocation();
//   const { id } = location.state || {};

//   const audioRef = useRef(null);
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   // const [currentTime, setCurrentTime] = useState(0);
//   const [canPlay, setCanPlay] = useState(false);

//   // console.log("Id::::: " + id);

//   const audioUrl = `https://s14.nm-cdn2.top/files/${id}/a/0/0.m3u8`;
//   const videoUrl = `https://s14.nm-cdn2.top/files/${id}/720p/-720p.m3u8`;

//   useEffect(() => {
//     // Setup HLS for video
//     if (videoRef.current) {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource(videoUrl);
//         hls.attachMedia(videoRef.current);
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = videoUrl;
//       }
//     }

//     // Setup HLS for audio
//     if (audioRef.current) {
//       if (Hls.isSupported()) {
//         const hlsAudio = new Hls();
//         hlsAudio.loadSource(audioUrl);
//         hlsAudio.attachMedia(audioRef.current);
//       } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         audioRef.current.src = audioUrl;
//       }
//     }
//   }, [videoUrl, audioUrl]);

//   useEffect(() => {
//     const handleLoadedMetadata = () => {
//       setCanPlay(true); // Set to true once the media is ready to play
//     };

//     if (videoRef.current && audioRef.current) {
//       videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
//       audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
//     }

//     return () => {
//       if (videoRef.current && audioRef.current) {
//         videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
//         audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       }
//     };
//   }, []);

//   const handleUserInteraction = () => {
//     if (canPlay && !isPlaying) {
//       try {
//         audioRef.current.play();
//         videoRef.current.play();
//         setIsPlaying(true);

//       } catch (err) {
//         console.error("Autoplay failed:", err);
//       }
//     }
//   };

//   useEffect(() => {
//     const playAfterInteraction = (e) => {
//       handleUserInteraction();
//       // Remove the event listener after the first interaction
//       window.removeEventListener("click", playAfterInteraction);
//       window.removeEventListener("touchstart", playAfterInteraction);
//     };

//     // Add listeners for click or touch to trigger play
//     window.addEventListener("click", playAfterInteraction);
//     window.addEventListener("touchstart", playAfterInteraction);

//     return () => {
//       window.removeEventListener("click", playAfterInteraction);
//       window.removeEventListener("touchstart", playAfterInteraction);
//     };
//   }, [canPlay, isPlaying]);

//   useEffect(() => {
//     const video = videoRef.current;
//     const audio = audioRef.current;

//     if (!video || !audio) return;

//     // Sync audio when video seeks or updates
//     const syncAudioTime = () => {
//       if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
//         audio.currentTime = video.currentTime;
//       }
//     };

//     const handlePlay = () => {
//       audio.play();
//     };

//     // When video is paused
//     const handlePause = () => {
//       audio.pause();
//     };

//     video.addEventListener("timeupdate", syncAudioTime);
//     video.addEventListener("seeking", syncAudioTime);
//     video.addEventListener("seeked", syncAudioTime);
//     video.addEventListener("play", handlePlay);
//     video.addEventListener("pause", handlePause);
//     return () => {
//       video.removeEventListener("timeupdate", syncAudioTime);
//       video.removeEventListener("seeking", syncAudioTime);
//       video.addEventListener("seeked", syncAudioTime);
//       video.removeEventListener("play", handlePlay);
//       video.removeEventListener("pause", handlePause);
//     };
//   }, []);

//   return (
//     <div>
//       <div style={ { width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
//         <video
//           ref={ videoRef }
//           width="100%"
//           height="auto"
//           controls={ true }
//           autoPlay={ true }
//           muted
//         />
//       </div>

//       <div>
//         <audio
//           ref={ audioRef }
//           controls={ false }
//         />
//       </div>
//     </div>
//   );
// };

// export default MediaSyncPlayer;







import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js"; // import hls.js
import { useLocation } from "react-router-dom";

const MediaSyncPlayer = () => {
  const location = useLocation();
  const { id } = location.state || {};

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const audioUrl = `https://s14.nm-cdn2.top/files/${id}/a/0/0.m3u8`;
  const videoUrl = `https://s14.nm-cdn2.top/files/${id}/720p/-720p.m3u8`;

  useEffect(() => {
    // Setup HLS for video
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoUrl;
      }
    }

    // Setup HLS for audio
    if (audioRef.current) {
      if (Hls.isSupported()) {
        const hlsAudio = new Hls();
        hlsAudio.loadSource(audioUrl);
        hlsAudio.attachMedia(audioRef.current);
      } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        audioRef.current.src = audioUrl;
      }
    }
  }, [videoUrl, audioUrl]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      setCanPlay(true); // Set to true once the media is ready to play
    };

    if (videoRef.current && audioRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoRef.current && audioRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handlePlay = () => {
    if (canPlay && !isPlaying) {
      try {
        // Check if video and audio are already playing
        if (videoRef.current.paused && audioRef.current.paused) {
          videoRef.current.play().then(() => {
            audioRef.current.play();
            setIsPlaying(true);
          }).catch(err => console.error("Play failed:", err));
        }
      } catch (err) {
        console.error("Autoplay failed:", err);
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current && audioRef.current) {
      videoRef.current.pause();
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Sync audio time with video time
    const syncAudioTime = () => {
      if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
        audio.currentTime = video.currentTime;
      }
    };

    // Handle seeking
    const handleSeek = () => {
      if (!audio.paused && video.currentTime !== audio.currentTime) {
        audio.currentTime = video.currentTime;
      }
    };

    video.addEventListener("timeupdate", syncAudioTime);
    video.addEventListener("seeked", handleSeek);

    return () => {
      video.removeEventListener("timeupdate", syncAudioTime);
      video.removeEventListener("seeked", handleSeek);
    };
  }, []);

  return (
    <div>
      <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          controls={true}
          muted
        />
      </div>

      <div>
        <audio
          ref={audioRef}
          controls={false}
        />
      </div>

      {/* <div className="epBtn">
        <button onClick={handlePlay}>▶ Play Now</button>
      </div>

      <div>
        <button onClick={handlePause}>Pause</button>
      </div> */}
    </div>
  );
};

export default MediaSyncPlayer;
