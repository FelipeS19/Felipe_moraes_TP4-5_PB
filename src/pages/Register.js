// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { register } from '../Utils/Criarconta';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dataNascimento, setdataNascimento] = useState('');
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setAlertSeverity('error');
            return;
        }

        try {
            const response = await register(name, email, password, dataNascimento, matricula);
            setMessage(response.message);
            setAlertSeverity('success');
            navigate('/login');
        } catch (error) {
            setMessage(error.message);
            setAlertSeverity('error');
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <Typography variant="h4" text="Create Account" />
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Matricula"
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                    <TextField
                        label="Data de Nascimento"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setdataNascimento(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        text="Register"
                    />
                </form>
                {message && <Alert severity={alertSeverity} message={message} />}
            </div>
        </div>
    );
};

export default Register;
