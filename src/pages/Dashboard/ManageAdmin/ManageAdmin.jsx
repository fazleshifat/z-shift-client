import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaUserShield, FaUserAltSlash, FaSearch } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';

const ManageAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    const {
        data: users = [],
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['user-by-email', search],
        enabled: false,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/search?email=${search}`);
            return res.data;
        },
        retry: false,
        onError: () => {
            Swal.fire('Not Found', 'No user matched', 'warning');
        }
    });

    useEffect(() => {
        if (search.length > 0) {
            refetch();
        }
    }, [search, refetch]);

    // updating the Role between (Admin and User)
    const updateRole = async (id, newRole) => {
        const action = newRole === 'admin' ? 'Make this user an Admin?' : 'Remove Admin role from this user?';

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: action,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return; // User cancelled, do nothing
        }

        try {
            const res = await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
            Swal.fire('Success', `Role updated to ${newRole}`, 'success');
            refetch(); // Refresh results
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Update failed', 'error');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Manager</h2>

            <div className="mb-4 w-md mx-auto flex items-center gap-2">
                <FaSearch className="text-xl" />
                <input
                    type="text"
                    placeholder="Search by email"
                    className="input input-bordered w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isFetching && <Spinner></Spinner>}

            {users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.created_at || 'N/A'}</td>
                                    <td>{user.role || 'user'}</td>
                                    <td>
                                        {user.role !== 'admin' ? (
                                            <button
                                                onClick={() => updateRole(user._id, 'admin')}
                                                className="btn btn-xs btn-success flex items-center gap-1"
                                            >
                                                <FaUserShield /> Make Admin
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateRole(user._id, 'user')}
                                                className="btn btn-xs btn-warning flex items-center gap-1"
                                            >
                                                <FaUserAltSlash /> Remove Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {search && !isFetching && users.length === 0 && (
                <p className="text-center text-gray-500">No users found.</p>
            )}
        </div>
    );
};

export default ManageAdmin;
