import PatientDashboard from "../pages/patient/PatientDashboard";
import UserProfilePage from "../pages/patient/UserProfilePage";
import ExamHistoryPage from "../pages/patient/ExamHistoryPage";
import ExamDetailPage from "../pages/patient/ExamDetailPage";
import BookingAppointmentPage from "../pages/patient/BookingAppointmentPage";
import SelectSpecialtyPage from "../pages/patient/SelectSpecialtyPage";
import PaymentPage from "../pages/patient/PaymentPage";
import UnderMyCarePage from "../pages/patient/UnderMyCarePage";
import KeyCodePage from "../pages/patient/KeyCodePage";
import MissedAppointmentsPage from "../pages/patient/MissedAppointmentsPage";
import BillingPage from "../pages/patient/BillingPage";
import MedicalRecordsPage from "../pages/patient/MedicalRecordsPage";
import AppointmentDetailPage from "../pages/patient/AppointmentDetailPage";
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
                <SelectSpecialtyPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/booking/details',
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
    {
        path: '/patient/missed-appointments',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <MissedAppointmentsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/billing',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <BillingPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/medical-records',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <MedicalRecordsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/appointment/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentDetailPage />
            </ProtectedRoute>
        )
    },
];

export default patientRoutes;