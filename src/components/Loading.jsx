import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <CircularProgress />
        </div>
    );
};

export default Loading;
