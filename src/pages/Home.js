// src/pages/Home.js
import React from 'react';
import Typography from '../components/Typography';
import './Home.css';

const Home = () => {

    return (
        <div className="home-container">
            <div className="home-content">
                <Typography variant="h4" text="Sistema de Gestão ACME " />
                <Typography variant="body1" text="Uso interno exclusivo " />


            </div>
        </div>
    );
};

export default Home;
