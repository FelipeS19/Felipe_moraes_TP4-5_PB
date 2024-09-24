import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import PropTypes from 'prop-types';
import './Typography.css';

const Typography = ({ variant, text }) => {
    return (
        <MuiTypography variant={variant} className="typography">
            {text}
        </MuiTypography>
    );
};

Typography.propTypes = {
    variant: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default Typography;
