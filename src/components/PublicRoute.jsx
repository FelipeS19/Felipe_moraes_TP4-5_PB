// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" /> : element;
};

export default PublicRoute;
