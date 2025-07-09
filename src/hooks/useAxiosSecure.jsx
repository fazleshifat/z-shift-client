import axios from 'axios';
import { config } from 'dotenv';
import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`,

})

const useAxiosSecure = () => {
    const { user, userLogOut } = use(AuthContext);
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        console.log('inside response interceptors', error.status);
        const status = error.status;
        if (status === 403) {
            navigate('/forbidden');
        }
        else if (status === 401) {
            userLogOut()
                .then(() => {

                    navigate('/login');
                })
                .catch(() => { })
        }

        return Promise.reject(error);
    })

    return axiosSecure;
};

export default useAxiosSecure;