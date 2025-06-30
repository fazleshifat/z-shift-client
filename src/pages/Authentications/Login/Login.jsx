import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log(data);
    }

    return (
        <>
            <div className='w-md mx-auto bg-base-100 p-5 rounded-3xl'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="">
                        <label className="label">Email</label>
                        <input type="email" {...register('email')} className="input w-full" placeholder="Email" />
                        <label className="label">Password</label>
                        <input type="password"
                            {...register('password', {
                                required: true,
                                minLength: 6
                            })}
                            className="input w-full" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-500'>password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-500'>password must be 6 character or longer</p>
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>
                        <div><p>Don't have any account?<Link to='/register' className="link link-hover text-primary pl-1">Register</Link></p></div>
                        <button className="btn w-full btn-neutral mt-4">Login</button>
                    </fieldset>
                </form>

                {/* social login */}
                <div className='mt-3'>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </>
    );
};

export default Login;