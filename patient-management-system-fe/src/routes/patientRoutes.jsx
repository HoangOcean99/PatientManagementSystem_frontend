import PatientDashboard from "../pages/patient/PatientDashboard";
import UserProfilePage from "../pages/patient/UserProfilePage";
import ChangePasswordPage from "../pages/patient/ChangePasswordPage";
import ExamHistoryPage from "../pages/patient/ExamHistoryPage";
import ExamDetailPage from "../pages/patient/ExamDetailPage";
import BookingAppointmentPage from "../pages/patient/BookingAppointmentPage";
import PaymentPage from "../pages/patient/PaymentPage";
import UnderMyCarePage from "../pages/patient/UnderMyCarePage";
import KeyCodePage from "../pages/patient/KeyCodePage";
import ProtectedRoute from '../components/security/ProtectedRoute';

const patientRoutes = [
    {
        path: '/patient/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/profile',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <UserProfilePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/change-password',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <ChangePasswordPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/exam-history',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <ExamHistoryPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/exam/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <ExamDetailPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/booking',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <BookingAppointmentPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/payment/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <PaymentPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/under-my-care',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <UnderMyCarePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/under-my-care/key',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <KeyCodePage />
            </ProtectedRoute>
        )
    },
];

export default patientRoutes;