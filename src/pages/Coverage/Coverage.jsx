import React from 'react';
import BangladeshMap from './BangladeshMap';
import { useLoaderData } from 'react-router';

const Coverage = () => {

    const serviceCenters = useLoaderData();

    return (
        <div className='max-w-7xl mx-auto px-4 py-10'>
            <BangladeshMap serviceCenters={serviceCenters}></BangladeshMap>
        </div>
    );
};

export default Coverage;