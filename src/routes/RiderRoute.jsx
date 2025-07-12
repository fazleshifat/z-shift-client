import React, { use } from 'react';
import useUserRole from '../hooks/useUserRole';
import Spinner from '../components/Spinner';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const RiderRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (roleLoading) return <Spinner />;

    if (user && role === 'rider') {
        return children;
    }

    return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default RiderRoute;