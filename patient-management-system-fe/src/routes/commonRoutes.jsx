import AuthCallback from "../pages/commonPage/AuthCallback";
import LandingPage from "../pages/commonPage/LandingPage";
import LoginPage from "../pages/commonPage/LoginPage";
import RegisterKidPage from "../pages/commonPage/RegisterKidPage";

const commonRoutes = [
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register-kid', element: <RegisterKidPage /> },
    { path: '/oauth-callback', element: <AuthCallback /> },
];

export default commonRoutes;