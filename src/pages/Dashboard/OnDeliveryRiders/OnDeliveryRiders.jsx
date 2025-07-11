import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';
import { format } from 'date-fns';

const OnDeliveryRiders = () => {
    const axiosSecure = useAxiosSecure();

    const { data: riders = [], isLoading, error } = useQuery({
        queryKey: ['onDeliveryRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/on-delivery');
            return res.data;
        },
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load riders.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Riders Currently On Delivery</h2>

            {riders.length === 0 ? (
                <p className="text-center text-gray-500">No riders currently on delivery.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>District</th>
                                <th>Region</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.phone}</td>
                                    <td>{rider.district}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.bikeBrand} ({rider.bikeRegNo})</td>
                                    <td>
                                        <span className="badge badge-info">{rider.status}</span>
                                    </td>
                                    <td>
                                        {rider.createdAt
                                            ? format(new Date(rider.createdAt), 'PPP')
                                            : 'N/A'}
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

export default OnDeliveryRiders;
