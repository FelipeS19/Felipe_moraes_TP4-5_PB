import React, { useState, useEffect } from 'react';
import TextField from '../components/TextField';
import Button from '../components/Button';
import './Formcontatos.css'; 

const Formcontatos = ({ onAddContato, initialValues }) => {
  const [contato, setContato] = useState(initialValues);

  useEffect(() => {
    setContato(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContato((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddContato(contato);
    resetForm();
  };

  const resetForm = () => {
    setContato(initialValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-contato-container">
        {renderTextFields()}
        <Button type="submit" text="Cadastrar Contato" onClick={handleSubmit} />
      </div>
    </form>
  );

  function renderTextFields() {
    const fields = [
      { name: "nome", label: "Nome" },
      { name: "cargo", label: "Cargo" },
      { name: "telefone", label: "Telefone" },
      { name: "email", label: "E-mail" },
      { name: "cnpjFornecedor", label: "CNPJ do Fornecedor" }
    ];

    return fields.map(({ name, label }) => (
      <TextField
        key={name}
        name={name}
        label={label}
        value={contato[name]}
        onChange={handleChange}
        required
      />
    ));
  }
};

export default Formcontatos;
