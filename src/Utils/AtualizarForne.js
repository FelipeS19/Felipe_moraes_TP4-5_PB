import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import axios from 'axios';

const UpdateFornecedorForm = ({ onUpdateFornecedor, initialValues }) => {
  const [fornecedor, setFornecedor] = useState(initialValues || {});

  useEffect(() => {
    setFornecedor(initialValues);
  }, [initialValues]);

  const fetchAddress = async (cep) => {
    const cepFormatted = cep.replace(/[-.]/g, '');
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepFormatted}/json/`);
      if (!response.data.erro) {
        updateAddressFields(response.data);
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      alert("Erro ao buscar o endereço.");
    }
  };

  const updateAddressFields = (data) => {
    setFornecedor((prev) => ({
      ...prev,
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedor((prev) => ({ ...prev, [name]: value }));

    if (name === 'cep' && value.replace(/[-.]/g, '').length === 8) {
      fetchAddress(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateFornecedor(fornecedor);
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderInputFields()}
      <Button type="submit" text="Atualizar Fornecedor" onClick={handleSubmit}/>
    </form>
  );

  function renderInputFields() {
    const fields = [
      { name: "nome", placeholder: "Nome", type: "text" },
      { name: "cep", placeholder: "CEP", type: "text" },
      { name: "telefone", placeholder: "Telefone", type: "text" }
    ];

    return fields.map(({ name, placeholder, type }) => (
      <input
        key={name}
        type={type}
        name={name}
        value={fornecedor[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required
      />
    ));
  }
};

export default UpdateFornecedorForm;
