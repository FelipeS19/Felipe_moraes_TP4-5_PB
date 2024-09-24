import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import Formfornecedor from '../Utils/FormFornecedor';
import UpdateFornecedorForm from '../Utils/AtualizarForne';
import Formcontatos from '../Utils/Formcontatos';
import Button from '../components/Button';
import Modal from 'react-modal';
import DataTable from '../components/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext'; 
import './Fornecedores.css';

Modal.setAppElement('#root');

const Fornecedores = () => {
  const { currentUser } = useAuth(); 
  const [fornecedores, setFornecedores] = useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    const fornecedoresCollection = collection(db, 'fornecedor');
    const fornecedorSnapshot = await getDocs(fornecedoresCollection);
    const fornecedorList = fornecedorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFornecedores(fornecedorList);
  };

  const fetchContatos = async (cnpj) => {
    const contatosCollection = collection(db, 'contatos');
    const q = query(contatosCollection, where('fornecedorCNPJ', '==', cnpj));
    const contatosSnapshot = await getDocs(q);
    const contatosList = contatosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setContatos(contatosList);
  };

  const addFornecedor = async (fornecedor) => {
    const docRef = await addDoc(collection(db, 'fornecedor'), fornecedor);
    setFornecedores(prev => [...prev, { id: docRef.id, ...fornecedor }]);
  };

  const updateFornecedor = async (updatedFornecedor) => {
    const fornecedorDoc = doc(db, 'fornecedor', selectedFornecedor.id);
    await updateDoc(fornecedorDoc, updatedFornecedor);
    const updatedData = { id: selectedFornecedor.id, ...updatedFornecedor };
    
    // Atualizar o estado local do fornecedor selecionado
    setSelectedFornecedor(updatedData);
    return updatedData; // Retornar os dados atualizados
  };

  const handleUpdateSuccess = (updatedFornecedor) => {
    setFornecedores(prev => prev.map(f => (f.id === updatedFornecedor.id ? updatedFornecedor : f)));
  };

  const addContato = async (contato) => {
    const newContato = { ...contato, fornecedorCNPJ: selectedFornecedor.cnpj };
    const docRef = await addDoc(collection(db, 'contatos'), newContato);
    setContatos(prev => [...prev, { id: docRef.id, ...newContato }]);
  };

  const deleteContato = async (id) => {
    await deleteDoc(doc(db, 'contatos', id));
    setContatos(prev => prev.filter(contato => contato.id !== id));
  };

  const openModal = async (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setShowUpdateForm(false);
    setShowContactForm(false);
    await fetchContatos(fornecedor.cnpj);
  };

  const closeModal = () => {
    setSelectedFornecedor(null);
    setShowUpdateForm(false);
    setShowContactForm(false);
  };

  const columns = [
    { id: 'nome', label: 'Nome' },
    { id: 'cnpj', label: 'CNPJ' },
    { id: 'cep', label: 'CEP' },
    { id: 'telefone', label: 'Telefone' },
  ];

  return (
    <div className='container-fornecedor'>
      <h1>Fornecedores</h1>
      <Formfornecedor onAddFornecedor={addFornecedor} />
      <h2>Lista de Fornecedores</h2>

      <div className="table-container">
      <DataTable data={fornecedores} columns={columns} onRowClick={openModal} className="glass-effect" />
    </div>
      <Modal isOpen={!!selectedFornecedor} onRequestClose={closeModal}>
        <h2>Detalhes do Fornecedor</h2>
        {selectedFornecedor && (
          <>
            <p>Nome: {selectedFornecedor.nome}
              {currentUser.role === 'admin' && ( 
                <EditIcon onClick={() => setShowUpdateForm(prev => !prev)} style={{ cursor: 'pointer' }} />
              )}
            </p>
            <p>CNPJ: {selectedFornecedor.cnpj}</p>
            <p>CEP: {selectedFornecedor.cep}</p>
            <p>Endereço: {selectedFornecedor.endereco}, {selectedFornecedor.bairro}, {selectedFornecedor.cidade}</p>
            <p>Telefone: {selectedFornecedor.telefone}</p>

            {showUpdateForm && currentUser.role === 'admin' && ( 
              <UpdateFornecedorForm
                onUpdateFornecedor={async (updatedData) => {
                  const updatedFornecedor = await updateFornecedor(updatedData);
                  handleUpdateSuccess(updatedFornecedor);
                }}
                initialValues={selectedFornecedor}
              />
            )}

            <Button text="Adicionar Contato" onClick={() => setShowContactForm(true)} />

            {showContactForm && (
              <Formcontatos
                onAddContato={addContato}
                initialValues={{ nome: '', cargo: '', telefone: '', email: '', cnpjFornecedor: selectedFornecedor.cnpj }}
                fornecedor={selectedFornecedor}
              />
            )}

            <h3>Contatos</h3>
            <ul>
              {contatos.map((contato) => (
                <li key={contato.id}>
                  {contato.nome} - {contato.cargo} - {contato.telefone} - {contato.email}
                  {currentUser.role === 'admin' && ( 
                    <Button
                      text="Excluir"
                      onClick={() => deleteContato(contato.id)}
                      icon={<DeleteIcon />}
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        <Button text="Fechar" onClick={closeModal} />
      </Modal>
    </div>
  );
};

export default Fornecedores;
