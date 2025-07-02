// components/RoleBasedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const [role, setRole] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
        setChecking(false);
    }, []);

    if (checking) return null; // or a loader

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default RoleBasedRoute;
