import React, { useState, useEffect } from 'react';
import Formcotacao from '../Utils/Formcotacao';
import ListaCotacoes from '../Utils/ListaCotacoes';
import FiltroCotacoes from '../Utils/FiltroCotacoes';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './Cotacoes.css';

const Cotacoes = () => {
  const [cotacoes, setCotacoes] = useState([]);
  const [filtro, setFiltro] = useState({ produto: '', preco: '', data: '', cnpj: '' });
  const [editingCotacao, setEditingCotacao] = useState(null);

  useEffect(() => {
    fetchCotacoes();
  }, []);

  const fetchCotacoes = async () => {
    const cotacoesCollection = collection(db, 'cotacoes');
    const cotacaoSnapshot = await getDocs(cotacoesCollection);
    const cotacaoList = cotacaoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCotacoes(cotacaoList);
  };

  const addCotacao = async (cotacao) => {
    try {
      const docRef = await addDoc(collection(db, 'cotacoes'), cotacao);
      setCotacoes(prev => [...prev, { id: docRef.id, ...cotacao }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteCotacao = async (id) => {
    try {
      await deleteDoc(doc(db, 'cotacoes', id));
      setCotacoes(prev => prev.filter(cotacao => cotacao.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const saveEditing = async (cotacao) => {
    try {
      const cotacaoDoc = doc(db, 'cotacoes', editingCotacao.id);
      await updateDoc(cotacaoDoc, cotacao);
      setCotacoes(prev => prev.map(c => (c.id === editingCotacao.id ? { ...c, ...cotacao } : c)));
      setEditingCotacao(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const filtrarCotacoes = () => {
    return cotacoes.filter(cotacao => {
      const produtoMatch = cotacao.produtos.some(prod =>
        prod.nome.toLowerCase().includes(filtro.produto.toLowerCase())
      );
      const precoMatch = !filtro.preco || cotacao.total <= filtro.preco;
      const dataMatch = !filtro.data || cotacao.data === filtro.data;
      const cnpjMatch = !filtro.cnpj || cotacao.produtos.some(prod => prod.cnpj === filtro.cnpj);
      return produtoMatch && precoMatch && dataMatch && cnpjMatch;
    });
  };

  return (
    <div className="container-cotacao">
      <h1>Cotações</h1>
      <div className="form-container">
        <Formcotacao
          onAddCotacao={editingCotacao ? saveEditing : addCotacao}
          initialValues={editingCotacao}
        />
      </div>
      <div className="filtro-container">
        <FiltroCotacoes filtro={filtro} setFiltro={setFiltro} />
      </div>
      <h2>Lista de Cotações</h2>
      <div className="lista-cotacoes">
        <ListaCotacoes
          cotacoes={filtrarCotacoes()}
          onDelete={deleteCotacao}
        />
      </div>
    </div>
  );
};

export default Cotacoes;
