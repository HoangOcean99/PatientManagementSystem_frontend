import AccountantDashboardPage from "../pages/accountantPage/AccountantDashboardPage";
import DepositManagementPage from "../pages/accountantPage/DepositManagementPage";
import InvoiceManagementPage from "../pages/accountantPage/InvoiceManagementPage";


const accountantRoutes = [
    { path: '/accountant', element: <AccountantDashboardPage /> },
    { path: '/accountant/dashboard', element: <AccountantDashboardPage /> },
    { path: '/accountant/deposits', element: <DepositManagementPage /> },
    { path: '/accountant/invoices', element: <InvoiceManagementPage /> },
];

export default accountantRoutes;