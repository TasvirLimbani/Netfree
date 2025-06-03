import React from 'react'
import NavBar from './NavBar'
import Banner from './Banner'
import Row from './Row'

const Home = ({ homeApi }) => {
    return (
        <>
            <NavBar />
            <Banner homeApi={ homeApi } />
            <Row homeApi={ homeApi } />
        </>
    )
}

export default Home