import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    FaCheckCircle,
    FaTruck,
    FaBoxOpen,
    FaHourglassHalf,
    FaTimesCircle,
} from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const statusConfig = {
        delivered: {
            label: 'Delivered',
            icon: <FaCheckCircle className="text-green-600 text-4xl" />,
        },
        in_transit: {
            label: 'In Transit',
            icon: <FaTruck className="text-blue-600 text-4xl" />,
        },
        not_collected: {
            label: 'Not Collected',
            icon: <FaBoxOpen className="text-yellow-600 text-4xl" />,
        },
        rider_assigned: {
            label: 'Rider Assigned',
            icon: <MdPendingActions className="text-purple-600 text-4xl" />,
        },
        cancelled: {
            label: 'Cancelled',
            icon: <FaTimesCircle className="text-red-600 text-4xl" />,
        },
    };

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['deliveryStatusCount'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery/status-count');
            return res.data;
        },
    });

    if (isLoading)
        return <div className="text-center py-6 text-lg font-medium">Loading delivery status...</div>;
    if (isError)
        return <div className="text-center py-6 text-red-600 font-medium">Failed to load data.</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
            {data.map(({ status, count }) => {
                const config = statusConfig[status] || {
                    label: status,
                    icon: <FaHourglassHalf className="text-gray-500 text-4xl" />,
                };

                return (
                    <div
                        key={status}
                        className="card shadow-md border hover:shadow-lg transition duration-300"
                    >
                        <div className="card-body flex items-center gap-4">
                            {config.icon}
                            <div className='flex flex-col items-center'>
                                <h2 className="text-xl font-semibold capitalize">{config.label}</h2>
                                <p className="text-3xl font-bold text-white">{count}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminDashboard;
