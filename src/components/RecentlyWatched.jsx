import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import lotiiejsonfile from '../assetse/loading.json'
import nodatajsonfile from '../assetse/nodata.json'
import Style from './Watchlist.module.css'

const RecentlyWatched = () => {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid); // user document ID = uid
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such user document!");
                }
            } else {
                console.log("User is not logged in.");
                setUserData(null);
            }
        });

        return () => unsubscribe(); // cleanup listener
    }, []);

    if (!userData) return <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' } }>
        <Lottie animationData={ lotiiejsonfile } style={ { height: '100px' } } loop={ true } />
    </div>;;
    return (
        <>
            <NavBar />
            <div className={ Style.mainres }>
                {
                    userData && userData.recently_playing && userData.recently_playing.length > 0 ? (
                        [...userData.recently_playing].reverse().map((data, index) => (
                            <div key={ index }>
                                <Link to={ `/movie/${data}` }>
                                    <img
                                        className={ Style.movieImg }
                                        src={ `https://imgcdn.media/pv/720/${data}.jpg` }
                                        alt=""
                                    />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div>
                            <Lottie animationData={ nodatajsonfile } style={ { height: '200px' } } loop={ true } />
                            <h1 style={ { color: 'white', textAlign: 'center', fontSize: '20px' } }>No movies added in Recently Playing</h1>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default RecentlyWatched