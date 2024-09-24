import React from 'react';
import TextField from '../components/TextField';

const FiltroCotacoes = ({ filtro, setFiltro }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filtro-cotacoes">
      {renderTextFields()}
    </div>
  );

  function renderTextFields() {
    const fields = [
      { name: "produto", label: "Filtrar por Produto", type: "text" },
      { name: "preco", label: "Filtrar por Preço Máximo", type: "number" },
      { name: "data", label: "Filtrar por Data", type: "date" }
    ];

    return fields.map(({ name, label, type }) => (
      <TextField
        key={name}
        name={name}
        label={label}
        type={type}
        value={filtro[name]}
        onChange={handleChange}
      />
    ));
  }
};

export default FiltroCotacoes;
