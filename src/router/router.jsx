import {
    createBrowserRouter,
} from "react-router";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentications/Login/Login";
import Register from "../pages/Authentications/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import SendParcel from "../pages/SendParcel/SendParcel";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import DeactivatedRiders from "../pages/Dashboard/DeactivatedRiders/DeactivatedRiders";
import RejectedRiders from "../pages/Dashboard/RejectedRiders/RejectedRiders";
import ManageAdmin from "../pages/Dashboard/ManageAdmin/ManageAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import OnDeliveryRiders from "../pages/Dashboard/OnDeliveryRiders/OnDeliveryRiders";
import RiderRoute from "../routes/RiderRoute";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/coverage',
                Component: Coverage,
                loader: async () => await fetch('./data/serviceCenters.json')
            },
            {
                path: '/forbidden',
                Component: Forbidden
            }
            ,
            {
                path: '/sendParcel',
                element: <PrivateRoute>
                    <SendParcel></SendParcel>
                </PrivateRoute>,
                loader: async () => await fetch('./data/serviceCenters.json')
            },
            {
                path: '/beARider',
                element: <PrivateRoute>
                    <BeARider></BeARider>
                </PrivateRoute>,
                loader: async () => await fetch('./data/serviceCenters.json')
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'payment-history',
                Component: PaymentHistory
            },
            {
                path: 'track-parcel',
                Component: TrackParcel
            },
            // rider only routes
            {
                path: 'pending-deliveries',
                element: <RiderRoute>
                    <PendingDeliveries></PendingDeliveries>
                </RiderRoute>
            },
            {

                path: 'completed-deliveries',
                element: <RiderRoute>
                    <CompletedDeliveries></CompletedDeliveries>
                </RiderRoute>
            },


            // admin only routes
            {
                path: 'assign-rider',
                element: <AdminRoute>
                    <AssignRider></AssignRider>
                </AdminRoute>
            }
            ,
            {
                path: 'active-riders',
                element: <AdminRoute>
                    <ActiveRiders></ActiveRiders>
                </AdminRoute>
            },
            ,
            {
                path: 'on-delivery-riders',
                element: <AdminRoute>
                    <OnDeliveryRiders></OnDeliveryRiders>
                </AdminRoute>
            },
            {
                path: 'pending-riders',
                element: <AdminRoute>
                    <PendingRiders></PendingRiders>
                </AdminRoute>
            },
            {
                path: 'rejected-riders',
                element: <AdminRoute>
                    <RejectedRiders></RejectedRiders>
                </AdminRoute>
            }
            ,
            {
                path: 'deactivated-riders',
                element: <AdminRoute>
                    <DeactivatedRiders></DeactivatedRiders>
                </AdminRoute>
            },
            {
                path: 'manage-admin',
                element: <AdminRoute>
                    <ManageAdmin></ManageAdmin>
                </AdminRoute>
            }
        ]
    }
]);