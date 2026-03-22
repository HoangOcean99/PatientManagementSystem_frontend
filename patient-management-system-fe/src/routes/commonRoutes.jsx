import PublicRoute from "../components/security/PublicRoute";
import DoctorListingPage from "../pages/adminPage/DoctorListingPage";
import AuthCallback from "../pages/commonPage/AuthCallback";
import ForgotPasswordPage from "../pages/commonPage/ForgotPasswordPage";
import LandingPage from "../pages/commonPage/LandingPage";
import LoginPage from "../pages/commonPage/LoginPage";
import RegisterKidPage from "../pages/commonPage/RegisterKidPage";

const commonRoutes = [
    {
        path: '/',
        element:
            <PublicRoute>
                <LandingPage />
            </PublicRoute>
    },
    {
        path: '/login',
        element:
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
    },
    {
        path: '/register-kid',
        element:
            <PublicRoute>
                <RegisterKidPage />
            </PublicRoute>
    },
    {
        path: '/oauth-callback',
        element:
            <PublicRoute>
                <AuthCallback />
            </PublicRoute>

    },
    {
        path: '/forget-password',
        element:
            <PublicRoute>
                <ForgotPasswordPage />
            </PublicRoute>
    },
];

export default commonRoutes;