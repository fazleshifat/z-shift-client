import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router';
import Spinner from '../components/Spinner';

const AdminRoute = ({ children }) => {

    const { user, loading } = use(AuthContext);
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return (
            <Spinner></Spinner>
        );
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children;
};

export default AdminRoute;