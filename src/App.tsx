import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { FeedbackProvider } from './context/FeedbackContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <FeedbackProvider>
                <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="/products/:id" element={<ProductDetailsPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/ai-assistant" element={<AiAssistantPage />} />

                      {/* Customer / Shared Cart & Order Routes */}
                      <Route path="/cart" element={<CartPage />} />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderDetailsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Dashboards with Role Protection */}
                      <Route
                        path="/farmer/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                            <FarmerDashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/customer/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                            <CustomerDashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch-all redirect */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </FeedbackProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
