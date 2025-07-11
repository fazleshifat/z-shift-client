import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';
import { FaUserPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const queryClient = useQueryClient();



    const assignRiderMutation = useMutation({
        mutationFn: async ({ parcelId, riderId }) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId,
            });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire("Success", "Rider assigned successfully", "success");
            document.getElementById("assignModal").close();
            queryClient.invalidateQueries(['assignableParcels']); // Refresh parcel list
        },
        onError: () => {
            Swal.fire("Error", "Failed to assign rider", "error");
        },
    });


    const { isLoading, data: parcels = [], error } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                '/parcels?payment_status=paid&delivery_status=not_collected'
            );
            return res.data;
        },
    });


    // Step 2: Open modal and load matching riders
    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setLoadingRiders(true);
        setRiders([]);

        try {
            const res = await axiosSecure.get("/riders/available", {
                params: {
                    district: parcel.senderCenter, // ✅ Correct key from your parcel data
                },
            });
            setRiders(res.data);
        } catch (error) {
            console.error("Error fetching riders", error);
            Swal.fire("Error", "Failed to load riders", "error");
        } finally {
            setLoadingRiders(false);
            document.getElementById("assignModal")?.showModal(); // Open modal
        }
    };



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
                                        <button
                                            className="btn btn-xs btn-primary flex items-center gap-1"
                                            onClick={() => openAssignModal(parcel)}
                                        >
                                            <FaUserPlus /> Assign Rider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* modal to open */}
            <dialog id="assignModal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <h3 className="font-bold text-lg">Available Riders</h3>

                    {loadingRiders ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : riders.length === 0 ? (
                        <p className="text-red-500">No riders found in this region.</p>
                    ) : (
                        <ul className="space-y-2">
                            {riders.map((rider) => (
                                <li key={rider._id} className="p-3 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{rider.name}</p>
                                        <p className="text-sm text-gray-400">{rider.email}</p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            assignRiderMutation.mutate({
                                                parcelId: selectedParcel._id,
                                                riderId: rider._id,
                                            })
                                        }
                                        className="btn btn-xs btn-primary">Assign</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default AssignRider;
