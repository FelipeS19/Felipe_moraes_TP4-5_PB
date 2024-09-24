// src/components/Navbar.jsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="toolbar">
        <Typography variant="h6" className="navbar-title">
          ACME
        </Typography>
        <div className="navbar-links">
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {!currentUser && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
          {currentUser && (
            <>
              <Button color="inherit" component={Link} to="/fornecedores">
                Fornecedores
              </Button>
              <Button color="inherit" component={Link} to="/cotaçoes">
                Cotações
              </Button>
              <Button color="inherit" component={Link} to="/Requisiçao">
                Requisição
              </Button>
              <Button color="inherit" onClick={handleMenuOpen}>
                <Avatar src={currentUser.avatar} alt={currentUser.name} />
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/MinhaConta" onClick={handleMenuClose}>
                  Minha Conta
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
