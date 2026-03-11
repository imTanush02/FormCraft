
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/Common/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormRenderer from './pages/FormRenderer';
import ResponseViewer from './pages/ResponseViewer';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form/:slug" element={<FormRenderer />} />

          <Route path="/dashboard" element={
            <AuthGuard><Dashboard /></AuthGuard>
          } />
          <Route path="/builder/:id" element={
            <AuthGuard><FormBuilder /></AuthGuard>
          } />
          <Route path="/responses/:id" element={
            <AuthGuard><ResponseViewer /></AuthGuard>
          } />

          {}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      {}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />
    </AuthProvider>
  );
}
