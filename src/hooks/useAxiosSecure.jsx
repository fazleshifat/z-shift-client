import axios from 'axios';
import { config } from 'dotenv';
import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`,

})

const useAxiosSecure = () => {
    const { user } = use(AuthContext);

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config;
    }, error => {
        return Promise.reject(error);
    })

    return axiosSecure;
};

export default useAxiosSecure;