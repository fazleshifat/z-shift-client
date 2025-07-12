import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { format } from 'date-fns';
import { FaMoneyCheckAlt } from 'react-icons/fa';

const CompletedDeliveries = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading, error } = useQuery({
        queryKey: ['completedDeliveries'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedDeliveries?email=${user.email}`);
            return res.data;
        },
    });

    const calculateEarnings = (parcel) => {
        const cost = parcel.deliveryCost || 0;
        const sameDistrict = parcel.senderCenter === parcel.receiverCenter;
        return sameDistrict ? cost * 0.8 : cost * 0.3;
    };

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load completed deliveries.</p>;

    const totalEarnings = parcels.reduce((sum, p) => sum + calculateEarnings(p), 0);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyCheckAlt className="text-green-500" /> Completed Deliveries & Earnings
            </h2>

            {parcels.length === 0 ? (
                <p className="text-center text-gray-500">No deliveries completed yet.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl shadow">
                        <table className="table table-zebra w-full text-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tracking ID</th>
                                    <th>Title</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Delivery Cost</th>
                                    <th>Picked At</th>
                                    <th>Delivered At</th>
                                    <th>Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parcels.map((parcel, index) => (
                                    <tr key={parcel._id}>
                                        <td>{index + 1}</td>
                                        <td>{parcel.trackingId}</td>
                                        <td>{parcel.title}</td>
                                        <td>
                                            {parcel.senderCenter}
                                            <br />
                                            <span className="text-xs text-gray-500">{parcel.senderCenter}</span>
                                        </td>
                                        <td>
                                            {parcel.receiverCenter}
                                            <br />
                                            <span className="text-xs text-gray-500">{parcel.receiverCenter}</span>
                                        </td>
                                        <td>৳{parcel.deliveryCost}</td>
                                        <td>{parcel.picked_at ? format(new Date(parcel.picked_at), 'PPP p') : 'N/A'}</td>
                                        <td>{parcel.delivered_at ? format(new Date(parcel.delivered_at), 'PPP p') : 'N/A'}</td>
                                        <td className="text-green-600 font-semibold">
                                            ৳{calculateEarnings(parcel).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-right mt-4 text-lg font-bold text-green-600">
                        Total Earnings: ৳{totalEarnings.toFixed(2)}
                    </div>
                </>
            )}
        </div>
    );
};

export default CompletedDeliveries;
