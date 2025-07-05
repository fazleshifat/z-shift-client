import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';

const BeARider = () => {

    const serviceCenters = useLoaderData();
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    // Extract unique regions
    const regions = [...new Set(serviceCenters.map(sc => sc.region))];

    // Function to get districts by region
    const getDistricts = region =>
        [...new Set(serviceCenters.filter(sc => sc.region === region).map(sc => sc.district))];

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: user?.displayName || '',
            email: user?.email || ''
        }
    });

    const selectedRegion = watch('region');
    const districts = selectedRegion ? getDistricts(selectedRegion) : [];


    const onSubmit = async data => {
        const riderData = {
            ...data,
            status: 'pending', // default status
            createdAt: new Date().toISOString(),
        };

        console.log('Rider application', riderData)

        try {
            const res = await axiosSecure.post('/riders', riderData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your rider application is now pending for review.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Please try again later.',
            });
        }
    };

    return (
        <div className="max-w-[1300px] flex mx-auto p-6 bg-base-100 rounded-xl shadow-md gap-10">
            {/* Left side: Form */}
            <div className=''>
                <h2 className="text-2xl font-bold mb-6">Be A Rider Application</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Name (full width readOnly) */}
                    <div className="">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            readOnly
                            {...register('name', { required: true })}
                            className="input input-bordered w-full cursor-not-allowed"
                        />
                    </div>

                    {/* Email (full width readOnly) */}
                    <div className="">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            readOnly
                            {...register('email', { required: true })}
                            className="input input-bordered w-full cursor-not-allowed"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="label">Age</label>
                        <input
                            type="number"
                            {...register('age', {
                                required: 'Age is required',
                                min: { value: 18, message: 'Minimum age is 18' },
                                max: { value: 65, message: 'Maximum age is 65' },
                            })}
                            className="input input-bordered w-full"
                            placeholder="Your age"
                        />
                        {errors.age && <p className="text-red-500">{errors.age.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="label">Phone Number</label>
                        <input
                            type="tel"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: 'Enter a valid phone number',
                                },
                            })}
                            className="input input-bordered w-full"
                            placeholder="e.g. 017xxxxxxxx"
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    </div>

                    {/* Region */}
                    <div>
                        <label className="label">Region</label>
                        <select
                            {...register('region', { required: 'Region is required' })}
                            className="select select-bordered w-full"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select Region
                            </option>
                            {regions.map(region => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                        {errors.region && <p className="text-red-500">{errors.region.message}</p>}
                    </div>

                    {/* District */}
                    <div>
                        <label className="label">District</label>
                        <select
                            {...register('district', { required: 'District is required' })}
                            className="select select-bordered w-full"
                            defaultValue=""
                            disabled={!selectedRegion}
                        >
                            <option value="" disabled>
                                {selectedRegion ? 'Select District' : 'Select Region First'}
                            </option>
                            {districts.map(district => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {errors.district && <p className="text-red-500">{errors.district.message}</p>}
                    </div>

                    {/* National ID Card */}
                    <div>
                        <label className="label">National ID Card Number</label>
                        <input
                            type="text"
                            {...register('nid', { required: 'NID is required' })}
                            className="input input-bordered w-full"
                            placeholder="Your NID number"
                        />
                        {errors.nid && <p className="text-red-500">{errors.nid.message}</p>}
                    </div>

                    {/* Bike Brand */}
                    <div>
                        <label className="label">Bike Brand</label>
                        <input
                            type="text"
                            {...register('bikeBrand', { required: 'Bike brand is required' })}
                            className="input input-bordered w-full"
                            placeholder="e.g. Honda, Yamaha"
                        />
                        {errors.bikeBrand && <p className="text-red-500">{errors.bikeBrand.message}</p>}
                    </div>

                    {/* Bike Registration Number */}
                    <div>
                        <label className="label">Bike Registration Number</label>
                        <input
                            type="text"
                            {...register('bikeRegNo', { required: 'Bike registration number is required' })}
                            className="input input-bordered w-full"
                            placeholder="e.g. Dhaka-1234"
                        />
                        {errors.bikeRegNo && <p className="text-red-500">{errors.bikeRegNo.message}</p>}
                    </div>

                    {/* License Number (optional) */}
                    <div>
                        <label className="label">License Number</label>
                        <input
                            type="text"
                            {...register('licenseNo')}
                            className="input input-bordered w-full"
                            placeholder="Your driving license number (optional)"
                        />
                    </div>

                    {/* Submit button full width */}
                    <div className="md:col-span-2">
                        <button type="submit" className="btn btn-primary w-full mt-4">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            {/* Right side: Image */}
            <div className="hidden lg:flex justify-center items-center">
                <img
                    src="../../../../public/assets/agent-pending.png"
                    alt="Rider"
                    className="rounded-xl shadow-lg max-h-[600px] object-cover"
                />
            </div>
        </div>

    );
};

export default BeARider;
