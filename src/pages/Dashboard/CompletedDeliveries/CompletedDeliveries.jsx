import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { format } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';

const CompletedDeliveries = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: deliveries = [], isLoading, error } = useQuery({
        queryKey: ['completedDeliveries'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedDeliveries?email=${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load completed deliveries.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-600">
                <FaCheckCircle className="text-green-500" /> Completed Deliveries
            </h2>

            {deliveries.length === 0 ? (
                <p className="text-center text-gray-500">No deliveries marked as completed.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Receiver</th>
                                <th>Region</th>
                                <th>Delivery Instruction</th>
                                <th>Status</th>
                                <th>Delivered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.trackingId}</td>
                                    <td>
                                        {parcel.receiverName}
                                        <br />
                                        <span className="text-xs text-gray-500">{parcel.receiverContact}</span>
                                    </td>
                                    <td>
                                        {parcel.receiverRegion}
                                        <br />
                                        <span className="text-xs text-gray-500">{parcel.receiverCenter}</span>
                                    </td>
                                    <td className="text-xs">{parcel.deliveryInstruction}</td>
                                    <td>
                                        <span className="badge badge-success">Delivered</span>
                                    </td>
                                    <td>
                                        {parcel.updated_at
                                            ? format(new Date(parcel.updated_at), 'PPP')
                                            : 'Completed'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;
