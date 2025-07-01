import React from 'react';

const Spinner = () => {
    return (
        <div className="h-[90vh] w-full flex items-center justify-center">
            <span className="loading loading-xl loading-dots text-indigo-300"></span>
        </div>
    );
};

export default Spinner;