import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DataTable from '../components/DataTable';
import Modal from 'react-modal';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import Papa from 'papaparse'; 
import './Requisiçao.css';

Modal.setAppElement('#root');

const Requisicao = () => {
  const { currentUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtosRenderizados, setProdutosRenderizados] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const unsubscribe = onSnapshot(pedidosCollection, (pedidosSnapshot) => {
        const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPedidos(pedidosList);
      }, (error) => {
        console.error('Erro ao buscar pedidos:', error);
      });

      const fornecedoresList = await fetchFornecedores();
      setFornecedores(fornecedoresList);

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const fetchFornecedores = async () => {
    const fornecedoresCollection = collection(db, 'fornecedor');
    const fornecedoresSnapshot = await getDocs(fornecedoresCollection);
    return fornecedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const renderProdutos = (produtos) => {
    const produtosPorCnpj = {};
    const fornecedoresMap = {};

    fornecedores.forEach(fornecedor => {
      fornecedoresMap[fornecedor.cnpj] = fornecedor.nome;
    });

    for (const prod of produtos) {
      const cnpj = prod.cnpj;
      const nomeLoja = fornecedoresMap[cnpj] || 'Loja Desconhecida';

      if (!produtosPorCnpj[cnpj]) {
        produtosPorCnpj[cnpj] = [];
      }
      produtosPorCnpj[cnpj].push({ nome: nomeLoja, produto: prod.nome, preco: prod.preco });
    }

    return Object.entries(produtosPorCnpj).map(([cnpj, itens]) => (
      <div key={cnpj}>
        <strong>{itens[0].nome} - {cnpj}</strong>
        {itens.map((item, index) => (
          <div key={index}>
            {item.produto} - R$ {item.preco.toFixed(2)}
          </div>
        ))}
      </div>
    ));
  };

  const handleRowClick = (row) => {
    setSelectedPedido(row);
    const produtos = renderProdutos(row.produtos);
    setProdutosRenderizados(produtos);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPedido(null);
    setProdutosRenderizados(null);
  };

  const updateStatus = async (newStatus) => {
    if (selectedPedido) {
      const pedidoRef = doc(db, 'pedidos', selectedPedido.id);
      await updateDoc(pedidoRef, { status: newStatus });
      handleCloseModal(); 
    }
  };

  const deletePedido = async () => {
    if (selectedPedido) {
      const pedidoRef = doc(db, 'pedidos', selectedPedido.id);
      await deleteDoc(pedidoRef);
      handleCloseModal(); 
    }
  };

  const exportToCSV = () => {
    if (selectedPedido) {
      const { id, ...pedidoSemId } = selectedPedido; 

      const csvData = [{
        ...pedidoSemId,
        produtos: selectedPedido.produtos.map(prod => `${prod.nome} - R$ ${prod.preco.toFixed(2)}`).join('; '),
      }];

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedido_${selectedPedido.pedidoId}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className='container-requisicao'>
        <h1>Requisição</h1>
        {pedidos.length > 0 ? (
            <div className="table-container">
                <DataTable
                    data={pedidos}
                    columns={[
                        { id: 'pedidoId', label: 'Número do Pedido' },
                        { id: 'dataPedido', label: 'Data do Pedido' },
                        { id: 'usuarioId', label: 'Requisitor' },
                        { id: 'total', label: 'Total' },
                        { id: 'status', label: 'Status' },
                    ]}
                    onRowClick={handleRowClick}
                    className="glass-effect"
                />
            </div>
        ) : (
            <p>Nenhum pedido encontrado.</p>
        )}

        <Modal isOpen={modalOpen} onRequestClose={handleCloseModal}>
            <h2>Detalhes do Pedido</h2>
            {selectedPedido && (
                <div>
                    <p><strong>Número do Pedido:</strong> {selectedPedido.pedidoId}</p>
                    <p><strong>Requisitor:</strong> {selectedPedido.usuarioId}</p>
                    <p><strong>Status:</strong> {selectedPedido.status}</p>
                    <p><strong>Data do Pedido:</strong> {selectedPedido.dataPedido}</p>
                    <p><strong>Produtos:</strong> {produtosRenderizados}</p>
                    <p><strong>Total:</strong> R$ {selectedPedido.total.toFixed(2)}</p>
                    <div>
                        {currentUser.role === 'admin' && (
                            <>
                                <Button text="Aprovar" onClick={() => updateStatus('Aprovado')} />
                                <Button text="Recusar" onClick={() => updateStatus('Recusado')} />
                            </>
                        )}
                        <Button text="Excluir" onClick={deletePedido} />
                        <Button text="Exportar CSV" onClick={exportToCSV} /> 
                    </div>
                </div>
            )}
            <Button text="Fechar" onClick={handleCloseModal} />
        </Modal>
    </div>
);
};

export default Requisicao;
