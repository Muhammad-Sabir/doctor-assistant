import React from 'react';
import { Navigate } from 'react-router-dom';

import { getAuthStatus } from '@/utils/auth'; 

const ProtectedRoute = ({ children, permission }) => {

    const { isAuthenticated, user } = getAuthStatus();
    
    // If the user is not authenticated and tries to open protected routes
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Role based access
    const hasPermission = user.role === permission;
    if (!hasPermission) {
        return <Navigate to={`/${user.role}`} replace />;
    }

    // Check if profile is completed
    if (user.role === 'doctor' && !user.is_profile_completed) {
        return <Navigate to="/complete-profile" />;
    }

    // If authenticated and has the required permission, render the protected children component
    return children;
};

export default ProtectedRoute;
