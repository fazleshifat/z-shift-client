import { use } from 'react';
import useAxiosSecure from './useAxiosSecure';
import { AuthContext } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

const useUserRole = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: role = 'user', isLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role?email=${user.email}`);
            return res.data.role;
        }
    });

    return { role, isLoading };
};

export default useUserRole;
