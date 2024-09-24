import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import DataTable from '../components/DataTable';
import './Account.css';

const Account = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    const columns = [
        { id: 'name', label: 'Nome' },
        { id: 'matricula', label: 'Matrícula' },
        { id: 'role', label: 'Nível' },
        { id: 'actions', label: 'Ações' },
    ];

    const handleRoleUpdate = async (userId, currentRole) => {
        if (userId === currentUser.uid) {
            alert("Você não pode se auto rebaixar!");
            return;
        }

        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, { role: newRole });

        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
    };

    const handleBlockUser = async (userId, isBlocked) => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, { isBlocked: !isBlocked });

        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, isBlocked: !isBlocked } : user
        );
        setUsers(updatedUsers);
        
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(prev => ({ ...prev, isBlocked: !isBlocked }));
        }
    };

    const handleRowClick = (rowData) => {
        setSelectedUser(rowData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    return (
        <div className='container-conta'>
            <h1>Minha conta</h1>
            <div className='content-conta'>
                <div className='minhaconta'>
                    {currentUser ? (
                        <div>
                            <Avatar className="avatar-conta" src={currentUser.avatar} alt={currentUser.name} />
                            <p><strong>{currentUser.name}</strong></p>
                            <p><strong>Matrícula:</strong> {currentUser.matricula}</p>
                            <p><strong>Data de Nascimento:</strong> {currentUser.dataNascimento}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <p><strong>Nível:</strong> {currentUser.role}</p>
                        </div>
                    ) : (
                        <p>Nenhum usuário logado.</p>
                    )}
                </div>
                <div className='gerenciaconta'>
                    {currentUser.role === 'admin' && (
                        <div className="table-container">
                            <DataTable
                                data={users.map(user => ({
                                    ...user,
                                    actions: user.id !== currentUser.uid && (
                                        <>
                                            <Button
                                                color={user.role === 'admin' ? 'secondary' : 'primary'}
                                                text={user.role === 'admin' ? 'Remover' : 'Promover'}
                                                onClick={() => handleRoleUpdate(user.id, user.role)}
                                            />
                                        </>
                                    ),
                                }))}
                                columns={columns}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedUser.name}</h2>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Matrícula:</strong> {selectedUser.matricula}</p>
                        <p><strong>Data de Nascimento:</strong> {selectedUser.dataNascimento}</p>
                        <p><strong>Nível:</strong> {selectedUser.role}</p>
                        <p><strong>Status:</strong> {selectedUser.isBlocked ? 'Bloqueado' : 'Ativo'}</p>
                        <Button
                            color={selectedUser.isBlocked ? 'success' : 'danger'}
                            text={selectedUser.isBlocked ? 'Desbloquear' : 'Bloquear'}
                            onClick={() => handleBlockUser(selectedUser.id, selectedUser.isBlocked)}
                        />
                        <Button text="Fechar" onClick={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
