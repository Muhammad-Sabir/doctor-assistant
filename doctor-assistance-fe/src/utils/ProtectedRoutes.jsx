import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, permission }) => {

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const { role, is_profile_completed } = user;
    
    // If the user is not authenticated and tries to open protected routes
    if (!role) {
        return <Navigate to="/login" />;
    }

    // Role based access
    const hasPermission = role === permission;
    if (!hasPermission) {
        return <Navigate to={`/${role}`} replace />;
    }

    // Check if profile is completed
    /* if (!is_profile_completed) {
        return <Navigate to="/complete-profile" />;
    } */

    // If authenticated and has the required permission, render the protected children component
    return children;
};

export default ProtectedRoute;
