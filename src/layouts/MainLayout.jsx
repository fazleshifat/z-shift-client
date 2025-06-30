import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../shared/Navbar.jsx/Navbar';
import Footer from '../shared/Footer/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <section className='max-w-7xl mx-auto'>
                <Outlet></Outlet>
            </section>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;