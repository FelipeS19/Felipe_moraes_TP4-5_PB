import React from 'react';
import { Checkbox as MuiCheckbox } from '@mui/material';
import PropTypes from 'prop-types';
import '../components/Checkbox.css';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className="custom-checkbox">
      <MuiCheckbox checked={checked} onChange={onChange} />
      <span>{label}</span>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
