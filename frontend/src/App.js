import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ChangePassword from './pages/auth/ChangePassword';
import ManageUsers from './pages/admin/ManageUsers';
import Dashboard from './pages/admin/Dashboard';
function App() {
  const getRole = () => localStorage.getItem('role');


  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/auth/login" element={<Login />} /> */}
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />

        {/* Protected Common Routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* User Routes */}
        <Route path="/profile" element={
          <PrivateRoute>
            {getRole() === "USER" ? <Profile /> : <Navigate to="/auth/login" replace />}
          </PrivateRoute>
        } />
        <Route path="/auth/change-password" element={
          <PrivateRoute>
            {getRole() === "USER" || "ADMIN" ? <ChangePassword /> : <Navigate to="/auth/login" replace />}
          </PrivateRoute>
        } />

        <Route path="/admin/manage-users" element={
          <PrivateRoute role="ADMIN">
            <ManageUsers />
          </PrivateRoute>
        } />

        <Route
          path="/auth/login"
          element={
            getRole() === "USER"
              ? <Navigate to="/profile" replace />
              : getRole() === "ADMIN"
                ? <Navigate to="/profile" replace />
                : <Login />
          }
        />

        <Route path="/admin/dashboard" element={
          <PrivateRoute role="ADMIN">
            <Dashboard />
          </PrivateRoute>
        } />


        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
