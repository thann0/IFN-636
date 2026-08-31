import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import PurchaseHistory from './pages/PurchaseHistory';
import SellerDashboard from './pages/SellerDashboard';
import ProductForm from './pages/ProductForm';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/catalogue" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            <Route path="/checkout/:id" element={
              <ProtectedRoute role="customer"><Checkout /></ProtectedRoute>
            } />
            <Route path="/purchases" element={
              <ProtectedRoute role="customer"><PurchaseHistory /></ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>
            } />
            <Route path="/products/new" element={
              <ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>
            } />
            <Route path="/products/:id/edit" element={
              <ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
