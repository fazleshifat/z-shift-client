import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const PendingDeliveries = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading, error } = useQuery({
        queryKey: ['riderTasks'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/parcels/${id}/status`, { status });
            return res.data;
        },
        onSuccess: (_, { status }) => {
            Swal.fire('Updated', `Parcel marked as ${status}`, 'success');
            queryClient.invalidateQueries(['riderTasks']);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update parcel status.', 'error');
        },
    });

    // Trigger function with Swal confirm before mutation
    const handleStatusChange = async (id, status) => {
        const result = await Swal.fire({
            title: `Mark parcel as "${status.replace('_', ' ')}"?`,
            text: 'Please confirm this action.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, mark as ${status.replace('_', ' ')}`,
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            updateStatusMutation.mutate({ id, status });
        }
    };

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load tasks.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>

            {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No pending deliveries assigned.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>Tracking ID</th>
                                <th>Title</th>
                                <th>Receiver</th>
                                <th>Pickup</th>
                                <th>Delivery</th>
                                <th>Status</th>
                                <th>Assigned At</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{parcel.trackingId}</td>
                                    <td>
                                        {parcel.title}
                                        <br />
                                        <span className="text-xs text-gray-500">From- {parcel.senderCenter}</span>
                                    </td>
                                    <td>
                                        {parcel.receiverName}
                                        <br />
                                        <span className="text-xs text-gray-500">{parcel.receiverCenter}</span>
                                    </td>
                                    <td className="text-xs">{parcel.pickupInstruction}</td>
                                    <td className="text-xs">{parcel.deliveryInstruction}</td>
                                    <td>
                                        <span className="badge badge-info">{parcel.delivery_status}</span>
                                    </td>
                                    <td>{parcel.assigned_at ? format(new Date(parcel.assigned_at), 'PPP') : 'N/A'}</td>
                                    <td className="text-xs">{parcel.deliveryCost}/=</td>
                                    <td>
                                        {parcel.delivery_status === 'rider_assigned' && (
                                            <button
                                                className="btn btn-xs btn-warning"
                                                onClick={() => handleStatusChange(parcel._id, 'on_transit')}
                                            >
                                                Mark as Picked Up
                                            </button>
                                        )}
                                        {parcel.delivery_status === 'on_transit' && (
                                            <button
                                                className="btn btn-xs btn-success"
                                                onClick={() => handleStatusChange(parcel._id, 'delivered')}
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
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

export default PendingDeliveries;
