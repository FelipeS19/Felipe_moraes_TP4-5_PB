import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const ListaCotacoes = ({ cotacoes, onDelete }) => { 
  const { currentUser } = useAuth();

  const generatePedidoId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handlePedido = async (cotacao) => {
    const dataPedido = new Date().toISOString().split('T')[0]; 

    const produtosComCNPJ = cotacao.produtos.map(prod => ({
      nome: prod.nome,
      preco: prod.preco,
      cnpj: prod.cnpj,
    }));

    const pedidoId = generatePedidoId(); 

    const pedido = {
      pedidoId: pedidoId,
      produtos: produtosComCNPJ,
      total: cotacao.total,
      usuarioId: currentUser.matricula, 
      status: "em análise",
      dataPedido: dataPedido,
    };

    console.log('Current User:', currentUser);
    console.log('Pedido:', pedido);

    try {
      await addDoc(collection(db, 'pedidos'), pedido);
      alert('Pedido enviado com sucesso!'); 
    } catch (error) {
      alert('Erro ao adicionar pedido: ', error);
    }
  };

  return (
    <ul className="lista-cotacoes">
      {cotacoes.map((cotacao) => (
        <li key={cotacao.id}>
          <div>
            <strong>Produtos:</strong>
            <ul>
              {cotacao.produtos.map((prod, prodIndex) => (
                <li key={prodIndex}>
                  {prod.nome} - R$ {prod.preco.toFixed(2)} (CNPJ: {prod.cnpj})
                </li>
              ))}
            </ul>
            <br />
            <strong>Data:</strong> {cotacao.data}
            <br />
            <strong>Total:</strong> R$ {cotacao.total.toFixed(2)}
            <br />
            <button onClick={() => onDelete(cotacao.id)}>
              <DeleteIcon />
            </button>
            <button onClick={() => handlePedido(cotacao)} style={{ marginLeft: '10px' }}>
              🛒 Fazer Pedido
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListaCotacoes;
