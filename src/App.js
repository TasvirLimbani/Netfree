import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./FirebaseSetup";
import { auth } from "./FirebaseSetup"; // Make sure to import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdblockDetector from "./AdblockDetector";

import Home from "./components/Home";
import MovieDetail from "./components/MovieDetail";
import Movieplay from "./components/Movieplay";
import AuthModal from "./components/AuthModal";
import SeriesPlayer from "./components/SeriesPlayer";
import SearchResults from "./components/SearchResults";
import Movies from "./components/Movies";
import TvShows from "./components/TvShows";
import Watchlist from "./components/Watchlist";
import RecentlyWatched from "./components/RecentlyWatched";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apis, setApis] = useState({
    HomeApi: "",
    EpisodeApi: "",
    DetailsApi: "",
  });

  useEffect(() => {
    // Check if the user is logged in or not
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user if logged in
      } else {
        setUser(null); // Set user to null if logged out
        navigate("/login"); // Redirect to login page if not logged in
      }
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Try to load APIs from localStorage
    const storedApis = JSON.parse(localStorage.getItem("apis"));

    if (storedApis) {
      // If data exists in localStorage, use it
      setApis(storedApis);
    } else {
      // Fetch APIs from Firebase if not in localStorage
      const fetchApis = async () => {
        try {
          const docRef = doc(db, "APIS", "APIS");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Save the fetched APIs to localStorage
            localStorage.setItem(
              "apis",
              JSON.stringify({
                HomeApi: data.HomeAPI,
                EpisodeApi: data.EpisodesDetailsAPI,
                DetailsApi: data.MovieDetailsAPI,
              })
            );

            // Update the state
            setApis({
              HomeApi: data.HomeAPI,
              EpisodeApi: data.EpisodesDetailsAPI,
              DetailsApi: data.MovieDetailsAPI,
            });
          } else {
            console.log("No such document in Firebase!");
          }
        } catch (error) {
          console.error("Error fetching Firebase APIs:", error);
        }
      };

      fetchApis();
    }
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      {/* <Routes>
        <Route path="/" element={ user ? (
              <>
                <Banner homeApi={ apis.HomeApi } />
                <Row homeApi={ apis.HomeApi } />
              </>
            ) : (
              <div>Loading...</div> // If not logged in, show nothing or loading screen
            )
          }
        />

        <Route path="/movie/:id" element={ <MovieDetail /> } />
        <Route path="/watch" element={ <Movieplay /> } />
        <Route path="/series" element={ <SeriesPlayer /> } />
        <Route path="/search" element={ <SearchResults /> } />
        <Route path="/login" element={ <AuthModal /> } />
      </Routes> */}
      <AdblockDetector
        onChange={(isBlocked) => {
          console.log("Adblocker detected:", isBlocked);
          // optionally send to analytics or adjust UX
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            user ? (
              <Home homeApi={apis.HomeApi} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/watch" element={<Movieplay />} />
        <Route path="/series" element={<SeriesPlayer />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<AuthModal />} />

        <Route path="/movies" element={<Movies homeApi={apis.HomeApi} />} />
        <Route path="/tv-shows" element={<TvShows homeApi={apis.HomeApi} />} />
        <Route
          path="/watchlist"
          element={<Watchlist homeApi={apis.HomeApi} />}
        />
        <Route
          path="/recently"
          element={<RecentlyWatched homeApi={apis.HomeApi} />}
        />
      </Routes>
    </>
  );
}

export default App;
