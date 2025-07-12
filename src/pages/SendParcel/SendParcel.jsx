import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useLoaderData, useNavigate } from "react-router";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useTrackingLogger from '../../hooks/useTrackingLogger';
import { use } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { logTracking } = useTrackingLogger();

    const serviceCenters = useLoaderData();
    const uniqueRegions = [...new Set(serviceCenters.map(w => w.region))];
    const getDistrictsByRegion = region => serviceCenters.filter(w => w.region === region).map(w => w.district);

    const parcelType = watch("type");
    const senderRegion = watch("senderRegion");
    const receiverRegion = watch("receiverRegion");

    const onSubmit = (data) => {

        if (data.type === "document") {
            delete data.weight; // ✅ remove weight if not needed
        }

        const weight = parseFloat(data.weight);
        const isSameDistrict = data.senderCenter === data.receiverCenter;

        let baseCost = 0;
        let extraCost = 0;
        let breakdown = "";

        if (data.type === "document") {
            baseCost = isSameDistrict ? 60 : 80;
            breakdown = `Document delivery ${isSameDistrict ? "within" : "outside"} the district.`;
        } else {
            if (weight <= 3) {
                baseCost = isSameDistrict ? 110 : 150;
                breakdown = `Non-document up to 3kg ${isSameDistrict ? "within" : "outside"} the district.`;
            } else {
                const extraKg = weight - 3;
                const perKgCharge = extraKg * 40;
                const districtExtra = isSameDistrict ? 0 : 40;
                baseCost = isSameDistrict ? 110 : 150;
                extraCost = perKgCharge + districtExtra;
                breakdown = `Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}${districtExtra ? "+ ৳40 cross-district" : ""}`;
            }
        }

        const totalCost = baseCost + extraCost;

        Swal.fire({
            title: "Confirm Parcel Details",
            html: `
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Weight:</strong> ${weight}kg</p>
                <p><strong>Cost:</strong> ৳${totalCost}</p>
                <p>${breakdown}</p>
            `,
            icon: "info",
            confirmButtonText: "💳 Proceed to Payment",
            denyButtonText: "✏️ Continue Editing",
            showDenyButton: true,
            confirmButtonColor: "#16a34a",
            denyButtonColor: "#d3d3d3",
            customClass: {
                popup: "rounded-xl shadow-md px-6 py-6",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const trackingId = generateTrackingID();
                const parcelData = {
                    ...data,
                    deliveryCost: totalCost,
                    created_by: user.email,
                    payment_status: 'unpaid',
                    delivery_status: 'not_collected',
                    creation_date: new Date().toISOString(),
                    trackingId,
                };

                const res = await axiosSecure.post('/parcels', parcelData);
                if (res.data.insertedId) {
                    await logTracking({
                        trackingId,
                        status: "parcel_created",
                        details: `Created by ${user.displayName}`,
                        updated_by: user.email,
                    });

                    Swal.fire("Saved", "Parcel and tracking created", "success");
                    navigate('/dashboard/myParcels');
                }
            }
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Send a Parcel</h2>
                    <p className="text-gray-500">Fill in the details below</p>
                </div>

                {/* Parcel Info */}
                <div className="border p-4 rounded-xl shadow space-y-4">
                    <h3 className="text-xl font-semibold">Parcel Info</h3>
                    <input {...register("title", { required: true })} className="input input-bordered w-full" placeholder="Parcel Title" />
                    {errors.title && <p className="text-red-500">Parcel title required</p>}

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="document" {...register("type", { required: true })} className="radio" /> Document
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="non-document" {...register("type", { required: true })} className="radio" /> Non-Document
                        </label>
                    </div>

                    <input
                        type="number"
                        step="0.1"
                        {...register("weight")}
                        disabled={parcelType !== "non-document"}
                        className="input input-bordered w-full"
                        placeholder="Weight (kg)"
                    />
                </div>

                {/* Sender/Receiver Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sender */}
                    <div className="border p-4 rounded-xl shadow space-y-3">
                        <h3 className="text-lg font-semibold">Sender Info</h3>
                        <input {...register("senderName", { required: true })} defaultValue={user.displayName} readOnly className="input input-bordered w-full cursor-not-allowed" placeholder="Sender Name" />
                        <input {...register("senderContact", { required: true })} className="input input-bordered w-full" placeholder="Contact" />
                        <select {...register("senderRegion", { required: true })} className="select select-bordered w-full">
                            <option value="">Select Region</option>
                            {uniqueRegions.map(region => <option key={region} value={region}>{region}</option>)}
                        </select>
                        <select {...register("senderCenter", { required: true })} className="select select-bordered w-full">
                            <option value="">Select District</option>
                            {getDistrictsByRegion(senderRegion).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input {...register("senderAddress", { required: true })} className="input input-bordered w-full" placeholder="Address" />
                        <textarea {...register("pickupInstruction", { required: true })} className="textarea textarea-bordered w-full" placeholder="Pickup Instruction" />
                    </div>

                    {/* Receiver */}
                    <div className="border p-4 rounded-xl shadow space-y-3">
                        <h3 className="text-lg font-semibold">Receiver Info</h3>
                        <input {...register("receiverName", { required: true })} className="input input-bordered w-full" placeholder="Receiver Name" />
                        <input {...register("receiverContact", { required: true })} className="input input-bordered w-full" placeholder="Contact" />
                        <select {...register("receiverRegion", { required: true })} className="select select-bordered w-full">
                            <option value="">Select Region</option>
                            {uniqueRegions.map(region => <option key={region} value={region}>{region}</option>)}
                        </select>
                        <select {...register("receiverCenter", { required: true })} className="select select-bordered w-full">
                            <option value="">Select District</option>
                            {getDistrictsByRegion(receiverRegion).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input {...register("receiverAddress", { required: true })} className="input input-bordered w-full" placeholder="Address" />
                        <textarea {...register("deliveryInstruction", { required: true })} className="textarea textarea-bordered w-full" placeholder="Delivery Instruction" />
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn btn-primary">Submit Parcel</button>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;
