import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-4 border-red-500">
                <div className="text-red-500 text-5xl mb-4">
                    <FaLock />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Forbidden</h1>
                <p className="text-gray-600 mb-6">
                    You don’t have permission to access this page. Please contact an ADMIN if you believe this is a mistake.
                </p>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;
