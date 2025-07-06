import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import { AuthContext } from '../../../contexts/AuthContext';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { userLogin } = use(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    console.log(location)

    const onSubmit = data => {
        userLogin(data.email, data.password)
            .then(res => {
                console.log(res.user);
                navigate(from, { replace: true });
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
                <div className="w-full max-w-md bg-base-100 shadow-xl p-8 rounded-3xl space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Login to Your Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">Email is required</p>
                            )}
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
                                <p className="text-red-500 text-sm mt-1">Password is required</p>
                            )}
                            {errors.password?.type === 'minLength' && (
                                <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
                            )}
                        </div>

                        {/* Forgot + Register */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <a href="#" className="link link-hover">
                                Forgot password?
                            </a>
                            <p>
                                Don’t have an account?
                                <Link state={{ from }} to="/register" className="link link-primary pl-1">
                                    Register
                                </Link>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-neutral w-full mt-2">
                            Login
                        </button>
                    </form>

                    {/* Social Login */}
                    <SocialLogin />
                </div>
            </div>
        </>
    );
};

export default Login;