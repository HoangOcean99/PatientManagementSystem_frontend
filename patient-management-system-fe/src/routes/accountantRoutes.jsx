import ProtectedRoute from '../components/security/ProtectedRoute';
import AccountantDashboardPage from '../pages/accountantPage/AccountantDashboardPage';
import AccountantProfilePage from '../pages/accountantPage/AccountantProfilePage';
import DepositManagementPage from '../pages/accountantPage/DepositManagementPage';
import InvoiceManagementPage from '../pages/accountantPage/InvoiceManagementPage';

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