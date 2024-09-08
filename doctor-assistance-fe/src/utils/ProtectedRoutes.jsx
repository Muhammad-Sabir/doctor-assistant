import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, permission }) => {
    const { user } = useContext(AuthContext);

    //If unauthenticated user tries to open dashboard links, redirect to auth/login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Role-based access control
    const hasPermission = user.role == permission;
    if (!hasPermission) {
        return <Navigate to={`/${user.role}`} replace/>;
    }

    //If the user is authenticated and has the required permission, render the protected children component  
    return children;
};

export default ProtectedRoute;
