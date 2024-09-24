import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const OptionSelect = ({ options, label, value, onChange }) => {
  const handleSelectChange = (event) => {
    onChange({ target: { name: 'cnpj', value: event.target.value } });
  };

  return (
<FormControl variant="outlined" className="custom-select">
  <InputLabel id="select-label">{label}</InputLabel>
  <Select
    labelId="select-label"
    value={value}
    onChange={handleSelectChange}
    label={label}
    name="cnpj"
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  );
};

export default OptionSelect;
