import PublicRoute from "../components/security/PublicRoute";
import AuthCallback from "../pages/commonPage/AuthCallback";
import ForgotPasswordPage from "../pages/commonPage/ForgotPasswordPage";
import LandingPage from "../pages/commonPage/LandingPage";
import LoginPage from "../pages/commonPage/LoginPage";
import RegisterKidPage from "../pages/commonPage/RegisterKidPage";
import DoctorListingPage from "../pages/doctor/DoctorListingPage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";

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
    {
        path: '/doctors',
        element: <DoctorListingPage />
    },
    {
        path: '/doctors/:id',
        element: <DoctorProfilePage />
    },
];

export default commonRoutes;