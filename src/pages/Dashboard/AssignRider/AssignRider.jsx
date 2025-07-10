import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';
import { FaUserPlus } from 'react-icons/fa';
import { format } from 'date-fns';

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: parcels = [], error } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                '/parcels?payment_status=paid&delivery_status=not_collected'
            );
            return res.data;
        },
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load parcels.</p>;

    // Sort by creation_date (most recent first)
    const sortedParcels = [...parcels].sort(
        (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

            {sortedParcels.length === 0 ? (
                <p className="text-center text-gray-500">No parcels available for assignment.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Receiver Name</th>
                                <th>Phone</th>
                                <th>District</th>
                                <th>Created At</th>
                                <th>Parcel Status</th>
                                <th>Delivery Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedParcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.tracking_id}</td>
                                    <td>{parcel.receiver_name}</td>
                                    <td>{parcel.receiver_phone}</td>
                                    <td>{parcel.district}</td>
                                    <td>{parcel.creation_date ? format(new Date(parcel.creation_date), 'PPP') : 'N/A'}</td>
                                    <td>
                                        <span className="badge badge-success">{parcel.payment_status}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-warning">{parcel.delivery_status}</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-xs btn-primary flex items-center gap-1">
                                            <FaUserPlus /> Assign Rider
                                        </button>
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

export default AssignRider;
