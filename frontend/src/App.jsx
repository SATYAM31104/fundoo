import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LabelProvider, useLabels } from './context/LabelContext';
import LabelManagerModal from './components/LabelManagerModal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Trash from './pages/Trash';
import Archive from './pages/Archive';
import Labels from './pages/Labels';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const GlobalComponents = () => {
  const { isLabelModalOpen, setLabelModalOpen } = useLabels();
  return (
    <LabelManagerModal
      isOpen={isLabelModalOpen}
      onClose={() => setLabelModalOpen(false)}
    />
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LabelProvider>
          <GlobalComponents />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trash"
              element={
                <PrivateRoute>
                  <Trash />
                </PrivateRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <PrivateRoute>
                  <Archive />
                </PrivateRoute>
              }
            />
            <Route
              path="/label/:labelName"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LabelProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
