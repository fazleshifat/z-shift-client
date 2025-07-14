import React from 'react';
import useUserRole from '../../../hooks/useUserRole';
import Spinner from '../../../components/Spinner';
import UserDashboard from './UserDashboard';
import RiderDashboard from './RiderDashboard';
import Forbidden from '../../Forbidden/Forbidden';
import AdminDashboard from './AdminDashboard';
import DeliveryStatusPieChart from './DeliveryStatusPieChart';

const DashboardHome = () => {

    const { role, roleLoading } = useUserRole();

    if (roleLoading) {
        return <Spinner></Spinner>;
    }

    if (role === 'user') {
        return <UserDashboard></UserDashboard>;
    }

    if (role === 'rider') {
        return <RiderDashboard></RiderDashboard>;
    }
    if (role === 'admin') {
        return <>
            <AdminDashboard></AdminDashboard>
            <DeliveryStatusPieChart></DeliveryStatusPieChart>
        </>;
    }

    else {
        return <Forbidden></Forbidden>;
    }
};

export default DashboardHome;