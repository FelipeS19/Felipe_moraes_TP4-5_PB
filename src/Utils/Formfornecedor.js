import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Typography from '../components/Typography';
import validarCNPJ from '../components/validarCNPJ';
import './Formfornecedor.css';

const Formfornecedor = ({ onAddFornecedor }) => {
  const initialFornecedorState = {
    nome: '',
    cnpj: '',
    cep: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: ''
  };

  const [fornecedor, setFornecedor] = useState(initialFornecedorState);

  const isValidCEP = (cep) => cep.replace(/[-.]/g, '').length === 8;

  const fetchAddress = useCallback(async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(/[-.]/g, '')}/json/`);
      if (!response.data.erro) {
        updateAddressFields(response.data);
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      alert("Erro ao buscar o endereço.");
    }
  }, []);

  useEffect(() => {
    if (isValidCEP(fornecedor.cep)) {
      fetchAddress(fornecedor.cep);
    }
  }, [fornecedor.cep, fetchAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatInputValue(name, value);
    setFornecedor((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const formatInputValue = (name, value) => {
    if (name === 'cnpj') return value.replace(/[^\d]/g, '');
    if (name === 'cep') return value.replace(/[^\d-]/g, '');
    return value;
  };

  const updateAddressFields = (data) => {
    setFornecedor((prev) => ({
      ...prev,
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const { valid, error } = validarCNPJ(fornecedor.cnpj);
      if (!valid) {
        alert(error);
        return;
      }

      const fornecedorData = formatFornecedorData();
      onAddFornecedor(fornecedorData);
      resetForm();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const isFormValid = () => Object.values(fornecedor).every(field => field.trim() !== '');

  const formatFornecedorData = () => {
    return {
      ...fornecedor,
      cnpj: formatCNPJ(fornecedor.cnpj),
      cep: formatCEP(fornecedor.cep)
    };
  };

  const formatCNPJ = (cnpj) => cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

  const formatCEP = (cep) => cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');

  const resetForm = () => {
    setFornecedor(initialFornecedorState);
  };

  return (
    <form className="form-fornecedor" onSubmit={handleSubmit}>
      <Typography variant="h3" text="Cadastrar Fornecedor" />
      <div className="form-fornecedor-container">
        {renderTextFields()}
        <Button type="submit" text="Cadastrar Fornecedor" onClick={handleSubmit}/>
      </div>
    </form>
  );

  function renderTextFields() {
    return Object.keys(initialFornecedorState).map((key) => (
      key !== 'endereco' && key !== 'bairro' && key !== 'cidade' && (
        <TextField
          key={key}
          name={key}
          label={capitalizeFirstLetter(key)}
          value={fornecedor[key]}
          onChange={handleChange}
          required
        />
      )
    ));
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

export default Formfornecedor;
