import React, { lazy } from 'react';
import ProtectedRoute from "../components/security/ProtectedRoute";

const Dashboard = lazy(() => import('../pages/receptionistPage/Dashboard'));
const Coordinator = lazy(() => import('../pages/receptionistPage/Coordinator'));
const ReceptionistProfile = lazy(() => import('../pages/receptionistPage/ReceptionistProfile'));

const receptionistRoutes = [
    {
        path: "/receptionist/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Dashboard />
            </ProtectedRoute>)

    },
    {
        path: "/receptionist/coordinator",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Coordinator />
            </ProtectedRoute>
        )
    },
    {
        path: "/receptionist/profile",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistProfile />
            </ProtectedRoute>
        )
    },
];

export default receptionistRoutes;