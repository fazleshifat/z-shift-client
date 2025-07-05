import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../contexts/AuthContext';
import { Link } from 'react-router';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const Register = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { createUser, updateUserProfile } = use(AuthContext);
    const [profilePicture, setProfilePicture] = useState('');
    const axiosInstance = useAxios();

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);

                // update user info in Database
                const userInfo = {
                    email: data.email,
                    role: 'user', // default role
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString(),
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);



                // update user profile in Firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePicture
                }
                // sending userProfile data to the firebase update auth
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('profile name and picture updated')
                    })
                    .catch(err => {
                        console.log(err)
                    })


            })
            .catch(err => console.log(err))

    }

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];

        const formData = new FormData();
        formData.append('image', image);

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`, formData);
        setProfilePicture(res.data.data.url);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset w-md mx-auto">

                    {/* name */}
                    <label className="label">Name</label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        className="input w-full"
                        placeholder="Full Name"
                    />
                    {errors.name?.type === 'required' && (
                        <p className="text-red-500">Name is required</p>
                    )}

                    {/* profile image */}
                    <label className="label">Profile Image</label>
                    <input
                        onChange={handleImageUpload}
                        type="file"
                        className="input w-full"
                        placeholder="upload profile image"
                    />


                    {/* email */}
                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        className="input w-full"
                        placeholder="Email"
                    />
                    {errors.email?.type === 'required' && (
                        <p className="text-red-500">Email is required</p>
                    )}

                    {/* password */}
                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: true,
                            minLength: 6,
                        })}
                        className="input w-full"
                        placeholder="Password"
                    />
                    {errors.password?.type === 'required' && (
                        <p className="text-red-500">Password is required</p>
                    )}
                    {errors.password?.type === 'minLength' && (
                        <p className="text-red-500">Password must be 6 characters or longer</p>
                    )}

                    <label className="label">Confirm Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (value) => value === watch('password') || "Passwords do not match",
                        })}
                        className="input w-full"
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500">{errors.confirmPassword.message || 'Confirm password is required'}</p>
                    )}
                    <p>Already have an account?<Link to='/login'><span className='text-primary underline pl-1'>Login</span></Link></p>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
            </form>

        </>
    );
};

export default Register;