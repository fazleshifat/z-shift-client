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
        mutationFn: async ({ parcelId, riderId, riderEmail }) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId,
                riderEmail
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
                                <th>Sender</th>
                                <th>Sender Contact</th>
                                <th>Sender District</th>
                                <th>Receiver</th>
                                <th>Receiver Phone</th>
                                <th>Created At</th>
                                <th>Payment</th>
                                <th>Parcel Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedParcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.trackingId}</td>
                                    <td>{parcel.senderName}</td>
                                    <td>{parcel.senderContact}</td>
                                    <td>{parcel.senderCenter}</td>
                                    <td>{parcel.receiverName}</td>
                                    <td>{parcel.receiverContact}</td>
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
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg mb-4">Available Riders</h3>

                    {loadingRiders ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : riders.length === 0 ? (
                        <p className="text-red-500">No riders found in this region.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="table table-zebra w-full text-sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>District</th>
                                        <th>Bike</th>
                                        <th>License</th>
                                        <th>Action</th>
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
                                            <td>{rider.bikeBrand} - {rider.bikeRegNo}</td>
                                            <td>{rider.licenseNo}</td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        assignRiderMutation.mutate({
                                                            parcelId: selectedParcel._id,
                                                            riderId: rider._id,
                                                            riderEmail: rider.email
                                                        })
                                                    }
                                                    className="btn btn-xs btn-primary"
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
