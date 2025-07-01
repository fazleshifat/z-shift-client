import React from 'react';
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <>
            <Link to='/'>
                <div className='flex items-end justify-center'>
                    <img src="/assets/logo.png" className='w-10' alt="logo" />
                    <p className='text-4xl font-bold -ml-3'>ProFast</p>
                </div>
            </Link>
        </>
    );
};

export default ProFastLogo;