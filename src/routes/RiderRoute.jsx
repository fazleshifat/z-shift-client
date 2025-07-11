import React, { use } from 'react';
import useUserRole from '../hooks/useUserRole';
import Spinner from '../components/Spinner';
import { Navigate } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const RiderRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return (
            <Spinner></Spinner>
        );
    }

    if (!user || role !== 'rider') {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children;
};

export default RiderRoute;