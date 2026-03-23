import React, { lazy } from 'react';
import ProtectedRoute from '../components/security/ProtectedRoute';

const LabQueuePage = lazy(() => import('../pages/labPage/LabQueuePage'));
const LabResultPage = lazy(() => import('../pages/labPage/LabResultPage'));
const LabProfilePage = lazy(() => import('../pages/labPage/LabProfilePage'));

const labRoutes = [
    {
        path: '/lab/queue',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabQueuePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/lab/result/:labOrderId',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabResultPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/lab/profile',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabProfilePage />
            </ProtectedRoute>
        )
    },
];

export default labRoutes;