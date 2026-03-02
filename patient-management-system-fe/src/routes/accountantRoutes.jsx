import AccountantDashboardPage from "../pages/accountantPage/AccountantDashboardPage";
import DepositManagementPage from "../pages/accountantPage/DepositManagementPage";
import InvoiceManagementPage from "../pages/accountantPage/InvoiceManagementPage";
import PaymentConfirmationPage from "../pages/accountantPage/PaymentConfirmationPage";

const accountantRoutes = [
    { path: '/accountant/dashboard', element: <AccountantDashboardPage /> },
    { path: '/accountant/deposits', element: <DepositManagementPage /> },
    { path: '/accountant/invoices', element: <InvoiceManagementPage /> },
    { path: '/accountant/payments', element: <PaymentConfirmationPage /> },
];

export default accountantRoutes;