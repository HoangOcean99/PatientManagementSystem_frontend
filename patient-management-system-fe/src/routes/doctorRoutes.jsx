import DoctorDashboardPage from "../pages/doctorPage/DoctorDashboardPage";
import DoctorSchedulePage from "../pages/doctorPage/DoctorSchedulePage";
import DoctorProfileSettingsPage from "../pages/doctorPage/DoctorProfileSettingsPage";
import PatientDetailPage from "../pages/doctorPage/PatientDetailPage";
import ExaminationPage from "../pages/doctorPage/ExaminationPage";
import ProtectedRoute from "../components/security/ProtectedRoute";

const doctorRoutes = [
    {
        path: '/doctor/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/schedule',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorSchedulePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/profile',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorProfileSettingsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/patient/:patientId',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <PatientDetailPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/examine/:appointmentId',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <ExaminationPage />
            </ProtectedRoute>
        )
    },
];

export default doctorRoutes;