import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { createUser, updateUserProfile } = use(AuthContext);
    const [profilePicture, setProfilePicture] = useState('');
    const [imageUploading, setImageUploading] = useState(false); // waiting to upload the photo then update firebase user

    const axiosInstance = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    console.log(location)

    const onSubmit = async (data) => {
        if (!profilePicture) {
            return alert("Please upload a profile picture before registering.");
        }

        try {
            const result = await createUser(data.email, data.password);
            console.log(result.user);

            // Save to DB
            const userInfo = {
                email: data.email,
                role: 'user',
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
            };

            await axiosInstance.post('/users', userInfo);

            // Set Firebase profile
            const userProfile = {
                displayName: data.name,
                photoURL: profilePicture,
            };

            await updateUserProfile(userProfile);

            navigate(from, { replace: true });
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };


    // function to turn Image file into url at imgBB hosting
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setImageUploading(true);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
                formData
            );
            setProfilePicture(res.data.data.url);
        } catch (error) {
            console.error('Image upload failed:', error);
        } finally {
            setImageUploading(false);
        }
    };


    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
                <div className="w-full max-w-md bg-base-100 shadow-xl p-8 rounded-3xl space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                placeholder="Full Name"
                                className="input input-bordered w-full"
                            />
                            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                        </div>

                        {/* Profile Image */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="file-input file-input-bordered w-full"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                placeholder="Email"
                                className="input input-bordered w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: true,
                                    minLength: 6,
                                })}
                                placeholder="Password"
                                className="input input-bordered w-full"
                            />
                            {errors.password?.type === 'required' && (
                                <p className="text-red-500 text-sm">Password is required</p>
                            )}
                            {errors.password?.type === 'minLength' && (
                                <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: true,
                                    validate: (value) =>
                                        value === watch('password') || 'Passwords do not match',
                                })}
                                placeholder="Confirm Password"
                                className="input input-bordered w-full"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Register Button */}
                        <button type="submit" className="btn btn-neutral w-full mt-2">
                            Register
                        </button>

                        {/* Login Redirect */}
                        <p className="text-sm text-center mt-2">
                            Already have an account?
                            <Link to="/login" className="text-primary pl-1 underline">
                                Login
                            </Link>
                        </p>
                    </form>

                    {/* Social Login */}
                    <SocialLogin />
                </div>
            </div>
        </>
    );
};

export default Register;