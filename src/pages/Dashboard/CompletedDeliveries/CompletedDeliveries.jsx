import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { format } from 'date-fns';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const CompletedDeliveries = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: parcels = [], isLoading, error } = useQuery({
        queryKey: ['completedDeliveries'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedDeliveries?email=${user.email}`);
            return res.data;
        },
    });

    const cashoutMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/rider/cashout/${id}`);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire('Success', 'Cashout successful!', 'success');
            queryClient.invalidateQueries(['completedDeliveries']);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to cash out', 'error');
        }
    });

    const handleCashout = (id) => {
        Swal.fire({
            title: 'Cashout Confirmation',
            text: 'Are you sure you want to cash out for this delivery?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cashout'
        }).then(result => {
            if (result.isConfirmed) {
                cashoutMutation.mutate(id);
            }
        });
    };

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
                                    <th>Status</th>
                                    <th>Earnings</th>
                                    <th>Cashout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parcels.map((parcel, index) => (
                                    <tr key={parcel._id}>
                                        <td>{index + 1}</td>
                                        <td>{parcel.trackingId}</td>
                                        <td>{parcel.title}</td>
                                        <td>{parcel.senderCenter}</td>
                                        <td>{parcel.receiverCenter}</td>
                                        <td>৳{parcel.deliveryCost}</td>
                                        <td>{parcel.delivery_status}</td>
                                        <td className="text-green-600 font-semibold">
                                            <span className='bg-yellow-200 font-bold px-3 py-1 rounded-3xl'>
                                                ৳{calculateEarnings(parcel).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-xs btn-success text-white"
                                                disabled={parcel.cashed_out}
                                                onClick={() => handleCashout(parcel._id)}
                                            >
                                                {parcel.cashed_out ? 'Cashed Out' : 'Cashout'}
                                            </button>
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
