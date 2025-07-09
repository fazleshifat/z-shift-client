import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Spinner from '../../../components/Spinner';

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedRider, setSelectedRider] = useState(null);

    // Fetch active riders
    const { isLoading, data: riders } = useQuery({
        queryKey: ['activeRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/active');
            return res.data;
        },
    });

    // Deactivate a rider
    const handleDeactivate = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This rider will be deactivated!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, deactivate!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/riders/${id}/status`, { status: 'deactivated' });
                    Swal.fire('Deactivated!', 'Rider has been deactivated.', 'success');
                    queryClient.invalidateQueries(['activeRiders']);
                } catch (error) {
                    Swal.fire('Error!', 'Deactivation failed.', 'error');
                    console.error(error);
                }
            }
        });
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

            {riders?.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No active riders.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>District</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders?.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.phone}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.district}</td>
                                    <td>{rider.bikeBrand}</td>
                                    <td>
                                        <span className='bg-gray-600 px-4 py-2 rounded-3xl text-yellow-300 uppercase'>
                                            {rider.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDeactivate(rider._id)}
                                        >
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedRider && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-[90%] max-w-xl shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-xl text-red-500"
                            onClick={() => setSelectedRider(null)}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">Rider Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Phone:</strong> {selectedRider.phone}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>District:</strong> {selectedRider.district}</p>
                            <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
                            <p><strong>Bike Reg No:</strong> {selectedRider.bikeRegNo}</p>
                            <p><strong>License:</strong> {selectedRider.licenseNo || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;
