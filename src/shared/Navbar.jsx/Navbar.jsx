import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {

    const { user } = use(AuthContext);

    const links =
        <>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/coverage'>Coverage</NavLink></li>
            <li><NavLink to='/sendParcel'>Send Parcel</NavLink></li>

            {
                user && <>
                    <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
                </>
            }

            <li><NavLink to='/about-us'>About Us</NavLink></li>
            <li><NavLink to='/contact'>Contact</NavLink></li>
        </>

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <div className='flex items-end justify-center'>
                    <img src="/assets/logo.png" className='w-10' alt="logo" />
                    <p className='text-4xl font-bold -ml-3'>ProFast</p>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                <Link className='btn' to='/login'>Login</Link>
                <Link className='btn' to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default Navbar;