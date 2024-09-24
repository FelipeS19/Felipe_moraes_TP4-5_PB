import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import PropTypes from 'prop-types';
import './TextField.css';

const TextField = ({ label, type = "text", value, onChange, name, required }) => {
    return (
        <MuiTextField
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            name={name} 
            required={required}
            className="custom-textfield"
        />
    );
};

TextField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
};

export default TextField;
