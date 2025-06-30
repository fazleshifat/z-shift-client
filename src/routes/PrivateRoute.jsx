import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Spinner from '../components/Spinner';

const PrivateRoute = ({ children }) => {

    const { user, loading } = use(AuthContext);

    const location = useLocation();

    if (loading) {
        return (
            <Spinner></Spinner>
        );
    }

    if (user) {
        return children;
    }

    return <Navigate to='/logIn' state={location.pathname} replace></Navigate>
};

export default PrivateRoute;