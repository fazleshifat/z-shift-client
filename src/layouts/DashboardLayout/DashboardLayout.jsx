import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProFastLogo from '../../shared/Logo/ProFastLogo';

// Icons
import {
    MdHome,
    MdOutlinePayment,
    MdTrackChanges,
    MdPerson,
    MdPending,
    MdOutlineCancel,
    MdBlock,
    MdPendingActions,
    MdDeliveryDining
} from 'react-icons/md';

import {
    FaBoxOpen,
    FaMotorcycle,
    FaUserShield,
    FaUserCheck,
    FaCheckCircle
} from 'react-icons/fa';

import useUserRole from '../../hooks/useUserRole';

const DashboardLayout = () => {

    const { role, isLoading } = useUserRole();
    console.log(role)

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Page content here */}
                    {/* Navbar */}
                    <div className="flex lg:hidden navbar bg-base-300 w-full">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className='mx-2 flex-1 px-2 lg:hidden'>Dashboard</div>

                    </div>


                    <div>
                        <Outlet></Outlet>
                    </div>

                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <ProFastLogo></ProFastLogo>
                        <li>
                            <NavLink to='/' className="flex items-center gap-2">
                                <MdHome className="text-lg" /> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/myParcels' className="flex items-center gap-2">
                                <FaBoxOpen className="text-lg" /> My Parcels
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/payment-history' className="flex items-center gap-2">
                                <MdOutlinePayment className="text-lg" /> Payment History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/track-parcel' className="flex items-center gap-2">
                                <MdTrackChanges className="text-lg" /> Track Parcel
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/update-profile' className="flex items-center gap-2">
                                <MdPerson className="text-lg" /> Update Profile
                            </NavLink>
                        </li>




                        {/* Rider Links */}
                        {
                            !isLoading && role === "rider" &&
                            <>
                                <li>
                                    <NavLink to="/dashboard/pending-deliveries" className="flex items-center gap-2">
                                        <MdPendingActions className="text-lg text-yellow-500" />
                                        Pending Deliveries
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/completed-deliveries" className="flex items-center gap-2">
                                        <FaCheckCircle className="text-lg text-green-500" />
                                        Completed Deliveries
                                    </NavLink>
                                </li>
                            </>
                        }

                        {/* Admin Links */}
                        {
                            !isLoading && role === "admin" &&
                            <>
                                <li>
                                    <NavLink to="/dashboard/assign-rider" className="flex items-center gap-2">
                                        <FaUserCheck className="text-lg text-green-600" />
                                        Assign Rider
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/active-riders' className="flex items-center gap-2">
                                        <FaMotorcycle className="text-lg text-emerald-600" />
                                        Active Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/on-delivery-riders' className="flex items-center gap-2">
                                        <MdDeliveryDining className="text-lg text-blue-600" />
                                        On Delivery Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/pending-riders' className="flex items-center gap-2">
                                        <MdPending className="text-lg text-yellow-600" />
                                        Pending Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/rejected-riders' className="flex items-center gap-2">
                                        <MdOutlineCancel className="text-lg text-red-600" />
                                        Rejected Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to='/dashboard/deactivated-riders' className="flex items-center gap-2">
                                        <MdBlock className="text-lg text-gray-500" />
                                        Deactivated Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/manage-admin" className="flex items-center gap-2">
                                        <FaUserShield className="text-lg text-purple-700" />
                                        Manage Admin
                                    </NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;