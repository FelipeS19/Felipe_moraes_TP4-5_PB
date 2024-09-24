// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AuthProvider from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Fornecedores from './pages/Fornecedores';
import Cotacoes from './pages/Cotacoes';
import Requisiçao from './pages/Requisiçao';
import Account from './pages/Account';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route path="/register" element={<PublicRoute element={<Register />} />} />
            <Route element={<PrivateRoute />}>
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/cotaçoes" element={<Cotacoes />} />
              <Route path="/Requisiçao" element={<Requisiçao />} />
              <Route path="/Minhaconta" element={<Account />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
