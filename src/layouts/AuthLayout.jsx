import React from 'react';
import { Outlet } from 'react-router';


const AuthLayout = () => {

    return (
        <>
            <div className="max-w-7xl mx-auto bg-base-200">
                <div className='flex items-end'>
                    <img src="/assets/logo.png" alt="logo" />
                    <p className='text-4xl font-bold -ml-3'>ProFast</p>
                </div>

                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className='flex-1'>
                        <img
                            src="/assets/authImage.png"
                            className="max-w-sm rounded-lg shadow-2xl"
                        />
                    </div>
                    <div className='flex-1'>
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;