// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';
import './Button.css';

const Button = ({ variant, color, text, onClick }) => {
  return (
    <MuiButton variant={variant} color={color} onClick={onClick} className="custom-button">
      {text}
    </MuiButton>
  );
};

Button.propTypes = {
  variant: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
