import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaCreditCard, FaPen } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const SendParcel = () => {

    const serviceCenters = useLoaderData();

    // Create list of unique regions
    const regions = [...new Set(serviceCenters.map(item => item.region))];

    // Function to get districts for selected region
    const getDistricts = (region) =>
        [...new Set(serviceCenters.filter(item => item.region === region).map(item => item.district))];

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // calling all custom hooks here
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();



    const parcelType = watch('type');
    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');

    const senderDistricts = senderRegion ? getDistricts(senderRegion) : [];
    const receiverDistricts = receiverRegion ? getDistricts(receiverRegion) : [];

    const onSubmit = (data) => {
        const baseCost = data.type === 'non-document' ? 200 : 100;
        const weightCost = data.weight ? parseFloat(data.weight) * 10 : 0;
        const isSameDistrict = data.senderCenter === data.receiverCenter;
        const outsideCharge = isSameDistrict ? 0 : 50;
        const totalCost = baseCost + weightCost + outsideCharge;

        MySwal.fire({
            title: 'Confirm Parcel Details',
            html: (
                <div className="text-left">
                    <p><strong>Parcel Type:</strong> {data.type}</p>
                    <p><strong>Title:</strong> {data.title}</p>
                    {data.type === 'non-document' && (
                        <p><strong>Weight:</strong> {data.weight} kg</p>
                    )}
                    <hr className="my-2" />
                    <p><strong>Sender:</strong> {data.senderName}, {data.senderContact}</p>
                    <p><strong>From:</strong> {data.senderRegion} - {data.senderCenter}</p>
                    <p><strong>Receiver:</strong> {data.receiverName}, {data.receiverContact}</p>
                    <p><strong>To:</strong> {data.receiverRegion} - {data.receiverCenter}</p>
                    <hr className="my-2" />
                    <p><strong>Cost Breakdown:</strong></p>
                    <ul className="list-disc ml-4">
                        <li>Base Cost: ৳{baseCost}</li>
                        <li>Weight Cost: ৳{weightCost}</li>
                        {!isSameDistrict && <li>Outside City Charge: ৳{outsideCharge}</li>}
                        <li><strong>Total: ৳{totalCost}</strong></li>
                    </ul>
                </div>
            ),
            showCancelButton: true,
            confirmButtonText: '💳 Proceed to payment',
            cancelButtonText: '✏️ Continue Editing',
            reverseButtons: true,
            preConfirm: () => {
                handleConfirm(data, totalCost);
            },
        });
    };

    const handleConfirm = (data, cost) => {

        const trackingId = 'PARCEL-' + Date.now() + '-' + Math.floor(Math.random() * 1000); // Semi-unique ID

        const parcelData = {
            ...data,
            deliveryCost: cost,
            trackingId,
            created_by: user.email,
            payment_status: 'unpaid',
            delivery_status: 'not_collected',
            creation_date: new Date().toISOString(),
        };
        console.log('Saving to DB:', parcelData);

        // adding data to DB from here
        axiosSecure.post('/parcels', parcelData)
            .then(res => {
                console.log(res.data);
                if (res.data.insertedId) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Parcel Saved Successfully! ✅',
                        html: `<p><strong>Tracking ID:</strong> ${trackingId}</p>
                               <p><strong>Delivery Cost:</strong> ৳${cost}</p>
                               <p><strong>Send as:</strong> ${user.displayName}</p>`,
                    });
                    navigate('/dashboard/myParcels');
                }
            })


    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2">Add Parcel</h2>
            <p className="text-gray-500 mb-6">
                As the system is based on Door to Door delivery, Parcel needs both pickup and delivery location.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Info */}
                <div className="border border-gray-300 p-4 rounded-xl">
                    <h2 className="text-lg font-semibold mb-4">Parcel Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">Parcel Type</label>
                            <div className="flex gap-6">
                                <label className="label cursor-pointer gap-2">
                                    <input
                                        type="radio"
                                        value="document"
                                        {...register("type", { required: true })}
                                        className="radio checked:bg-blue-500"
                                    />
                                    <span className="label-text">Document</span>
                                </label>
                                <label className="label cursor-pointer gap-2">
                                    <input
                                        type="radio"
                                        value="non-document"
                                        {...register("type", { required: true })}
                                        className="radio checked:bg-blue-500"
                                    />
                                    <span className="label-text">Non-Document</span>
                                </label>
                            </div>
                            {errors.type && <span className="text-red-500">Type is required</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">Title</label>
                            <input className="input input-bordered w-full" {...register('title', { required: true })} />
                            {errors.title && <span className="text-red-500">Title is required</span>}
                        </div>

                        {parcelType === 'non-document' && (
                            <div className="form-control">
                                <label className="label">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input input-bordered w-full"
                                    {...register('weight')}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender & Receiver Combined */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-xl">
                    {/* Sender Info */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Sender Info</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input className="input input-bordered w-full cursor-not-allowed" readOnly defaultValue={user.displayName} placeholder="Sender Name" {...register('senderName', { required: true })} />
                            {errors.senderName && <span className="text-red-500">Sender name is required</span>}
                            <input className="input input-bordered w-full" placeholder="Sender Contact" {...register('senderContact', { required: true })} />
                            {errors.senderContact && <span className="text-red-500">Contact is required</span>}
                            <select className="select select-bordered w-full" {...register('senderRegion', { required: true })}>
                                <option value="">Select Region</option>
                                {regions.map(region => <option key={region} value={region}>{region}</option>)}
                            </select>
                            <select className="select select-bordered w-full" {...register('senderCenter', { required: true })}>
                                <option value="">Select Service Center</option>
                                {senderDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <textarea className="textarea textarea-bordered w-full" placeholder="Sender Address" {...register('senderAddress', { required: true })} />
                            <textarea className="textarea textarea-bordered w-full" placeholder="Pickup Instruction" {...register('pickupInstruction', { required: true })} />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Receiver Info</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input className="input input-bordered w-full" placeholder="Receiver Name" {...register('receiverName', { required: true })} />
                            {errors.receiverName && <span className="text-red-500">Receiver name is required</span>}
                            <input className="input input-bordered w-full" placeholder="Receiver Contact" {...register('receiverContact', { required: true })} />
                            {errors.receiverContact && <span className="text-red-500">Contact is required</span>}
                            <select className="select select-bordered w-full" {...register('receiverRegion', { required: true })}>
                                <option value="">Select Region</option>
                                {regions.map(region => <option key={region} value={region}>{region}</option>)}
                            </select>
                            <select className="select select-bordered w-full" {...register('receiverCenter', { required: true })}>
                                <option value="">Select Service Center</option>
                                {receiverDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <textarea className="textarea textarea-bordered w-full" placeholder="Receiver Address" {...register('receiverAddress', { required: true })} />
                            <textarea className="textarea textarea-bordered w-full" placeholder="Delivery Instruction" {...register('deliveryInstruction', { required: true })} />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">Submit Parcel</button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default SendParcel;
