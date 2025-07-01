import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaTrash, FaEye, FaCreditCard } from 'react-icons/fa';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';

const MyParcels = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const handleView = (parcel) => {
        console.log('View:', parcel);
    };

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    const handleDelete = async (parcel) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete parcel: ${parcel.title}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/parcels/${parcel._id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire('Deleted!', 'Parcel has been deleted.', 'success');
                }
                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'Failed to delete parcel.', 'error');
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            {isLoading ? (
                <p className="text-center text-gray-500 py-10">Loading parcels...</p>
            ) : parcels.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No parcel data found.</p>
            ) : (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Created At</th>
                            <th>Cost (৳)</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td className="max-w-[180px] truncate={}">{parcel.title}</td>
                                <td className="capitalize">{parcel.type}</td>
                                <td>{format(new Date(parcel.creation_date), 'PPPp')}</td>
                                <td>৳{parcel.deliveryCost}</td>
                                <td>
                                    <span
                                        className={`badge badge-sm ${parcel.payment_status === 'paid'
                                            ? 'badge-success'
                                            : 'badge-error'
                                            }`}
                                    >
                                        {parcel.payment_status}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-xs btn-outline   "
                                        onClick={() => handleView(parcel)}
                                    >
                                        <FaEye className="text-white" />
                                        View
                                    </button>
                                    {parcel.payment_status !== 'paid' && (
                                        // <Link to={`/dashboard/payment/${parcel._id}`}>

                                        // </Link>
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => handlePay(parcel._id)}
                                        >
                                            <FaCreditCard className="text-white" />
                                            Pay
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-xs bg-red-500"
                                        onClick={() => handleDelete(parcel)}
                                    >
                                        <FaTrash className="text-white" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyParcels;
