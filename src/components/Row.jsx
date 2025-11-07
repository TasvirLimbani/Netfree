import React, { useEffect, useState } from "react";
import Style from "./Row.module.css";
import GenreSection from "./GenreSection.jsx";

const Row = ({ homeApi }) => {
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!homeApi) return; // 🛑 STOP if homeApi is not ready

    fetch(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://net51.cc/pv/homepage.php")
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        const post = parsed.post;

        const cleaned = post.map((item) => ({
          title: item.cate,
          movieIds: item.ids.split(","),
        }));
        setLoading(false);
        setGenreData(cleaned);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [homeApi]); // 👈 Make sure homeApi is in dependency array

  if (loading) {
    return (
      <div className={Style.rowContainer}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={Style.skeletonGenreSection}>
            <div className={Style.skeletonTitle}></div>
            <div className={Style.skeletonSlider}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={Style.skeletonPoster}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {genreData.map((genre, index) => (
        <GenreSection
          key={index}
          title={genre.title}
          movieIds={genre.movieIds}
        />
      ))}
    </div>
  );
};

export default Row;
