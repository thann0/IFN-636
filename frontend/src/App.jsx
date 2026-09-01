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

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/catalogue" replace />} />

          {/* Auth pages - NO navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages with navbar */}
          <Route
            path="/catalogue"
            element={
              <MainLayout>
                <Catalogue />
              </MainLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <MainLayout>
                <ProductDetail />
              </MainLayout>
            }
          />

          {/* Customer routes */}
          <Route
            path="/checkout/:id"
            element={
              <MainLayout>
                <ProtectedRoute role="customer">
                  <Checkout />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/purchases"
            element={
              <MainLayout>
                <ProtectedRoute role="customer">
                  <PurchaseHistory />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* Seller routes */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/products/new"
            element={
              <MainLayout>
                <ProtectedRoute role="seller">
                  <ProductForm />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <MainLayout>
                <ProtectedRoute role="seller">
                  <ProductForm />
                </ProtectedRoute>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
