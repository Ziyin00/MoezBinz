import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";


import LoginPage from "./pages/logIn";
import SignUpPage from "./pages/signUp";
import ForgotPasswordPage from "./pages/forgotPassword";
import PasswordUpdatedPage from "./pages/passwordUpdated";
import ResetPasswordPage from "./pages/resetPassword";
import HomePage from "./pages/home";
import Product from "./pages/products";
import Visit from "./pages/visit";
import AdminDashboard from "./pages/adminDashboard";

import BackToTopButton from "./components/BackToTopButton";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";
import { store } from "./store";
import { setupInterceptors } from "./api/axios";

// create persistor once using store
const persistor = persistStore(store);

function App() {
  // Setup API interceptors after store is initialized
  React.useEffect(() => {
    setupInterceptors(store);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        }
        persistor={persistor}
      >
        <BrowserRouter>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/password-updated" element={<PasswordUpdatedPage />} />
              <Route path="/product" element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              } />
              <Route path="/visit" element={
                <ProtectedRoute>
                  <Visit />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
            <BackToTopButton />
          </main>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
