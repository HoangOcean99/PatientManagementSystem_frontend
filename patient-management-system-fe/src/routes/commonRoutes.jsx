import AuthCallback from "../pages/commonPage/AuthCallback";
import LandingPage from "../pages/commonPage/LandingPage";
import LoginPage from "../pages/commonPage/LoginPage";
import RegisterKidPage from "../pages/commonPage/RegisterKidPage";
import DoctorListingPage from "../pages/doctor/DoctorListingPage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";

const commonRoutes = [
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register-kid', element: <RegisterKidPage /> },
    { path: '/oauth-callback', element: <AuthCallback /> },
    { path: '/doctors', element: <DoctorListingPage /> },
    { path: '/doctors/:id', element: <DoctorProfilePage /> },
];

export default commonRoutes;