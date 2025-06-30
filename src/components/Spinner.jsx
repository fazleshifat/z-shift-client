import React from 'react';

const Spinner = () => {
    return (
        <div className="h-[90vh] w-full flex items-center justify-center">
            <span className="loading loading-dotted text-gray-500 w-10"></span>
        </div>
    );
};

export default Spinner;