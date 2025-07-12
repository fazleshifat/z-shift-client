import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { format, isThisWeek, isToday, isThisMonth, isThisYear } from 'date-fns';
import { FaChartBar } from 'react-icons/fa';

const MyEarnings = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: deliveries = [], isLoading, error } = useQuery({
        queryKey: ['myEarnings'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedDeliveries?email=${user.email}`);
            return res.data;
        },
    });

    const calculateEarning = (parcel) => {
        const cost = parcel.deliveryCost || 0;
        const sameDistrict = parcel.senderCenter === parcel.receiverCenter;
        return sameDistrict ? cost * 0.8 : cost * 0.3;
    };

    const total = deliveries.reduce((sum, p) => sum + calculateEarning(p), 0);
    const totalCashedOut = deliveries.filter(p => p.cashed_out).reduce((sum, p) => sum + calculateEarning(p), 0);
    const totalPending = total - totalCashedOut;

    // Filters for analysis
    const weekly = deliveries.filter(p => isThisWeek(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const today = deliveries.filter(p => isToday(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const monthly = deliveries.filter(p => isThisMonth(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const yearly = deliveries.filter(p => isThisYear(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load earnings data.</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaChartBar className="text-blue-500" /> My Earnings Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 shadow rounded-xl border-l-4 border-green-500">
                    <h4 className="text-gray-500">Total Earnings</h4>
                    <p className="text-2xl font-bold text-green-600">৳{total.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 shadow rounded-xl border-l-4 border-yellow-500">
                    <h4 className="text-gray-500">Cashed Out</h4>
                    <p className="text-2xl font-bold text-yellow-600">৳{totalCashedOut.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 shadow rounded-xl border-l-4 border-rose-500">
                    <h4 className="text-gray-500">Pending Cashout</h4>
                    <p className="text-2xl font-bold text-rose-600">৳{totalPending.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-100 p-4 shadow rounded-xl">
                    <h5 className="text-gray-500">Today</h5>
                    <p className="text-xl font-semibold text-blue-600">৳{today.toFixed(2)}</p>
                </div>
                <div className="bg-base-100 p-4 shadow rounded-xl">
                    <h5 className="text-gray-500">This Week</h5>
                    <p className="text-xl font-semibold text-blue-600">৳{weekly.toFixed(2)}</p>
                </div>
                <div className="bg-base-100 p-4 shadow rounded-xl">
                    <h5 className="text-gray-500">This Month</h5>
                    <p className="text-xl font-semibold text-blue-600">৳{monthly.toFixed(2)}</p>
                </div>
                <div className="bg-base-100 p-4 shadow rounded-xl">
                    <h5 className="text-gray-500">This Year</h5>
                    <p className="text-xl font-semibold text-blue-600">৳{yearly.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default MyEarnings;
