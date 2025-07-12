import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import {
    format,
    isThisWeek,
    isToday,
    isThisMonth,
    isThisYear
} from 'date-fns';
import {
    FaChartBar,
    FaMoneyBillWave,
    FaWallet,
    FaCalendarDay,
    FaCalendarWeek,
    FaCalendarAlt,
    FaCalendar
} from 'react-icons/fa';

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

    const weekly = deliveries.filter(p => isThisWeek(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const today = deliveries.filter(p => isToday(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const monthly = deliveries.filter(p => isThisMonth(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);
    const yearly = deliveries.filter(p => isThisYear(new Date(p.delivered_at))).reduce((sum, p) => sum + calculateEarning(p), 0);

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load earnings data.</p>;

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-3 text-3xl font-bold">
                <FaChartBar className="text-blue-600" />
                <span>My Earnings Dashboard</span>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-l-4 border-green-500 rounded-xl shadow p-5">
                    <div className="flex items-center gap-3 text-xl font-semibold text-green-600">
                        <FaMoneyBillWave />
                        <span>Total Earnings</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-green-700">৳{total.toFixed(2)}</p>
                </div>
                <div className="bg-white border-l-4 border-yellow-500 rounded-xl shadow p-5">
                    <div className="flex items-center gap-3 text-xl font-semibold text-yellow-600">
                        <FaWallet />
                        <span>Cashed Out</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-yellow-700">৳{totalCashedOut.toFixed(2)}</p>
                </div>
                <div className="bg-white border-l-4 border-rose-500 rounded-xl shadow p-5">
                    <div className="flex items-center gap-3 text-xl font-semibold text-rose-600">
                        <FaWallet />
                        <span>Pending Cashout</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-rose-700">৳{totalPending.toFixed(2)}</p>
                </div>
            </div>

            {/* Analysis Section */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-200">Earning Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="bg-base-100 p-5 rounded-xl shadow border">
                        <div className="flex items-center gap-2 text-blue-200">
                            <FaCalendarDay />
                            <span className="text-sm text-gray-200">Today</span>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-blue-300">৳{today.toFixed(2)}</p>
                    </div>
                    <div className="bg-base-100 p-5 rounded-xl shadow border">
                        <div className="flex items-center gap-2 text-blue-200">
                            <FaCalendarWeek />
                            <span className="text-sm text-gray-200">This Week</span>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-blue-300">৳{weekly.toFixed(2)}</p>
                    </div>
                    <div className="bg-base-100 p-5 rounded-xl shadow border">
                        <div className="flex items-center gap-2 text-blue-200">
                            <FaCalendarAlt />
                            <span className="text-sm text-gray-200">This Month</span>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-blue-300">৳{monthly.toFixed(2)}</p>
                    </div>
                    <div className="bg-base-100 p-5 rounded-xl shadow border">
                        <div className="flex items-center gap-2 text-blue-200">
                            <FaCalendar />
                            <span className="text-sm text-gray-200">This Year</span>
                        </div>
                        <p className="mt-1 text-2xl font-semibold text-blue-300">৳{yearly.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEarnings;
