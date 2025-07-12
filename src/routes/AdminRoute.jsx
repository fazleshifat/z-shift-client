import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';
import Spinner from '../components/Spinner';

const AdminRoute = ({ children }) => {

    const { user, loading } = use(AuthContext);
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (roleLoading) {
        return <Spinner />; // Or your custom loader
    }

    if (user && role === 'admin') {
        return children;
    }

    return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default AdminRoute;