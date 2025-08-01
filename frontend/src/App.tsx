import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import NotFound from './components/NotFound';
import AuthButton from './components/AuthButton';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './services/AuthService';

// Main App Function with authentication logic
function App() {
  return (
<Router>
      <AuthButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={[UserRole.Admin, UserRole.LandRegistrar]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRoles={[UserRole.User]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

