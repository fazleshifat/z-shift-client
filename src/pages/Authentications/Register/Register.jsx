import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../contexts/AuthContext';
import { Link } from 'react-router';

const Register = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { createUser } = use(AuthContext);

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => console.log(result.user))
            .catch(err => console.log(err))

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset w-md mx-auto">
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