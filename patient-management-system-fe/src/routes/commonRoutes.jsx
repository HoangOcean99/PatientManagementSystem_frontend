import AuthCallback from "../pages/commonPage/AuthCallback";
import ForgotPasswordPage from "../pages/commonPage/ForgotPasswordPage";
import LandingPage from "../pages/commonPage/LandingPage";
import LoginPage from "../pages/commonPage/LoginPage";
import RegisterKidPage from "../pages/commonPage/RegisterKidPage";

const commonRoutes = [
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register-kid', element: <RegisterKidPage /> },
    { path: '/oauth-callback', element: <AuthCallback /> },
    { path: '/forget-password', element: <ForgotPasswordPage /> },
];

export default commonRoutes;