import React from 'react';
import { Alert as MuiAlert } from '@mui/material';
import PropTypes from 'prop-types';
import '../components/Alert.css';

const Alert = ({ severity, message }) => {
  return (
    <MuiAlert severity={severity} className="custom-alert">
      {message}
    </MuiAlert>
  );
};

Alert.propTypes = {
    severity: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};


export default Alert;
