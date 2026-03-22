import React, { lazy } from 'react';
import ProtectedRoute from '../components/security/ProtectedRoute';
const AccountantDashboardPage = lazy(() => import('../pages/accountantPage/AccountantDashboardPage'));
const AccountantProfilePage = lazy(() => import('../pages/accountantPage/AccountantProfilePage'));
const DepositManagementPage = lazy(() => import('../pages/accountantPage/DepositManagementPage'));
const InvoiceManagementPage = lazy(() => import('../pages/accountantPage/InvoiceManagementPage'));

const accountantRoutes = [
    {
        path: '/accountant/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["accountant"]}>
                <AccountantDashboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/accountant/deposits',
        element: (
            <ProtectedRoute allowedRoles={["accountant"]}>
                <DepositManagementPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/accountant/invoices',
        element: (
            <ProtectedRoute allowedRoles={["accountant"]}>
                <InvoiceManagementPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/accountant/profile',
        element: (
            <ProtectedRoute allowedRoles={["accountant"]}>
                <AccountantProfilePage />
            </ProtectedRoute>
        )
    },
];

export default accountantRoutes;