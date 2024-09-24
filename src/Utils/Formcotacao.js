import React, { useState, useEffect } from 'react';
import TextField from '../components/TextField';
import Button from '../components/Button';
import OptionSelect from '../components/OptionSelect';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Formcotacao.css';

const Formcotacao = ({ onAddCotacao, initialValues }) => {
  const [produto, setProduto] = useState({ nome: '', preco: '', cnpj: '', quantidade: 1 });
  const [produtos, setProdutos] = useState([]);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    const fetchFornecedores = async () => {
      const fornecedoresCollection = collection(db, 'fornecedor');
      const fornecedorSnapshot = await getDocs(fornecedoresCollection);
      const fornecedorList = fornecedorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFornecedores(fornecedorList);
    };
    fetchFornecedores();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setProdutos(initialValues.produtos);
      setData(initialValues.data);
    }
  }, [initialValues]);

  const handleProdutoChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduto = () => {
    if (produto.nome && produto.preco && produto.cnpj && produto.quantidade) {
      const novoProduto = {
        ...produto,
        preco: parseFloat(produto.preco),
        total: parseFloat(produto.preco) * produto.quantidade,
      };
      setProdutos((prev) => [...prev, novoProduto]);
      setProduto({ nome: '', preco: '', cnpj: '', quantidade: 1 });
    } else {
      alert('Por favor, preencha todos os campos do produto.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data && produtos.length > 0) {
      const total = calcularTotal(produtos);
      const cotacao = { data, produtos, total };
      await onAddCotacao(cotacao);
      resetForm();
    } else {
      alert('Por favor, preencha todos os campos e adicione pelo menos um produto.');
    }
  };

  const calcularTotal = (produtos) => {
    return produtos.reduce((acc, prod) => acc + prod.total, 0);
  };

  const resetForm = () => {
    setProdutos([]);
    setData(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-cotacao-container">
        <TextField
          name="nome"
          label="Produto"
          value={produto.nome}
          onChange={handleProdutoChange}
          required
        />
        <TextField
          name="preco"
          label="Preço Unitário"
          type="number"
          value={produto.preco}
          onChange={handleProdutoChange}
          required
        />
        <TextField
          name="quantidade"
          label="Quantidade"
          type="number"
          value={produto.quantidade}
          onChange={handleProdutoChange}
          required
        />
        <OptionSelect
          options={fornecedores.map(f => ({ value: f.cnpj, label: f.nome }))}
          label="Selecione o Fornecedor"
          value={produto.cnpj}
          onChange={handleProdutoChange}
          name="cnpj"
          className="custom-select"
        />
        <TextField
          name="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <Button type="button" text="Adicionar Produto" onClick={handleAddProduto} />
      </div>
      <Button type="submit" text="Cadastrar Cotação" onClick={handleSubmit} />
      <h4>Total: {calcularTotal(produtos).toFixed(2)}</h4>
    </form>
  );
};

export default Formcotacao;
