import React, { useEffect, useRef, useState } from 'react';
import Style from './Navbar.module.css';
import { auth } from '../FirebaseSetup';
import { signOut } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { db } from '../FirebaseSetup'; // your firebase setup file
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// import appApk from '../../public/net-free.apk'


const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [setUserData, setSetUserData] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [showSearchDialog, setShowSearchDialog] = useState(false);
    const [searchDots, setSearchDots] = useState('');

    const [loading, setLoading] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleToggle = () => {
        setOpen(prev => !prev);
    };

    const handleToggle2 = () => {
        setOpen2(prev => !prev);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, 'users', user.uid); // users/{uid}
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                setSetUserData(userData);
            } else {
                console.log('No such user document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])

    const handleLogout = () => {
        setIsLoggingOut(true);

        signOut(auth)
            .then(() => {
                console.log('Logged out successfully');
                Navigate('/login');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
                setIsLoggingOut(false);
            });
    };

    useEffect(() => {
        if (!loading) return;

        const dotCycle = ['.', '..', '...'];
        let index = 0;

        const interval = setInterval(() => {
            setSearchDots(dotCycle[index]);
            index = (index + 1) % dotCycle.length;
        }, 400);

        return () => clearInterval(interval); // Cleanup when loading stops
    }, [loading]);


    const handleSearch = async () => {
        if (!searchText.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(`https://api.allorigins.win/get?url=https://netfree2.cc/pv/search.php?s=${searchText}`);
            const data = await response.json();

            navigate('/search', { state: { results: data } });
        } catch (error) {
            console.error('Search error:', error);
            toast.error("Failed to search")
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <>
            <div className={ Style.navMargin }>
                <div className={ Style.nav }>
                    <div className={ Style.leftNav }>
                        <button className={ Style.menuIcon } onClick={ handleToggle2 }>
                            ☰
                        </button>
                        <img
                            className={ Style.logo }
                            src="/assets/images/netfree-logo.png"
                            alt="Netflix Logo"
                        />
                        <div className={ Style.navLinks }>
                            <button className={ Style.homeBtn } style={ { color: location.pathname === '/home' ? 'red' : 'white' } } onClick={ () => navigate('/home') }>Home</button>
                            <button className={ Style.moviebtn } style={ { color: location.pathname === '/movies' ? 'red' : 'white' } } onClick={ () => navigate('/movies') }>Movies</button>
                            <button className={ Style.seriesBtn } style={ { color: location.pathname === '/tv-shows' ? 'red' : 'white' } } onClick={ () => navigate('/tv-shows') }>Tv-Shows</button>
                            <button className={ Style.seriesBtn } style={ { color: location.pathname === '/watchlist' ? 'red' : 'white' } } onClick={ () => navigate('/watchlist') }>Watchlist</button>
                            <button className={ Style.seriesBtn } style={ { color: location.pathname === '/recently' ? 'red' : 'white' } } onClick={ () => navigate('/recently') }>Recently</button>
                        </div>
                    </div>
                    { open2 && (
                        <div className={ Style.mobileMenu }>
                            <button className={ Style.homeBtn } style={ { borderBottom: '2px solid rgb(54, 54, 54)', color: location.pathname === '/home' ? 'red' : 'white' } } onClick={ () => navigate('/home') }>Home</button>
                            <button className={ Style.moviebtn } style={ { borderBottom: '2px solid rgb(54, 54, 54)', color: location.pathname === '/movies' ? 'red' : 'white' } } onClick={ () => navigate('/movies') }>Movies</button>
                            <button className={ Style.seriesBtn } style={ { borderBottom: '2px solid rgb(54, 54, 54)', color: location.pathname === '/tv-shows' ? 'red' : 'white' } } onClick={ () => navigate('/tv-shows') }>Tv-Shows</button>
                            <button className={ Style.seriesBtn } style={ { borderBottom: '2px solid rgb(54, 54, 54)', color: location.pathname === '/watchlist' ? 'red' : 'white' } } onClick={ () => navigate('/watchlist') }>Watchlist</button>
                            <button className={ Style.seriesBtn } style={ { borderBottom: '2px solid rgb(54, 54, 54)', color: location.pathname === '/recently' ? 'red' : 'white' } } onClick={ () => navigate('/recently') }>Recently</button>
                        </div>
                    ) }

                    <div className={ Style.navRightSec }>
                        <a href="/net-free.apk" download>
                            <button className={ Style.downloadBtn }>Download</button>
                        </a>
                        <div className={ Style.srchsec }>
                            <FontAwesomeIcon icon={ faMagnifyingGlass } className={ Style.searchIcon }
                                onClick={ () => setShowSearchDialog(true) } />
                        </div>
                        <img
                            className={ Style.avatar }
                            src="/assets/images/Netflix-avatar.png"
                            alt="User Avatar"
                            onClick={ handleToggle }
                        />
                    </div>
                    { showSearchDialog && (
                        <div className={ Style.searchModalOverlay }>
                            <form onSubmit={ (e) => { e.preventDefault(); handleSearch(); } } className={ Style.searchModal }>
                                <button
                                    className={ Style.closeBtn }
                                    onClick={ () => setShowSearchDialog(false) }
                                    type='button'
                                >
                                    ✕
                                </button>
                                <input
                                    className={ Style.searchInp }
                                    type="text"
                                    required
                                    value={ searchText }
                                    placeholder='Search here...'
                                    onChange={ (e) => setSearchText(e.target.value) }
                                />
                                { loading && (
                                    <p style={ { color: 'red', fontSize: '14px', marginTop: '4px' } }>
                                        Searching{ searchDots }
                                    </p>
                                ) }
                                <button disabled={ loading } type='submit' className={ Style.searchIcon }><FontAwesomeIcon icon={ faMagnifyingGlass } /></button>
                            </form>
                        </div>
                    ) }
                    { open && (
                        <div className={ Style.dropdown }>
                            <img src="/assets/images/Netflix-avatar.png" alt="" />
                            <p className={ Style.nname }>{ setUserData?.name || "No Name" }</p>
                            <p className={ Style.emmaill }>{ setUserData?.email || "No Email" }</p>
                            <button onClick={ handleLogout }>{ isLoggingOut ? 'Logging out...' : 'Log Out' }</button>
                        </div>
                    ) }
                </div>
                <ToastContainer limit={ 2 } />
            </div>
        </>
    )
}

export default NavBar