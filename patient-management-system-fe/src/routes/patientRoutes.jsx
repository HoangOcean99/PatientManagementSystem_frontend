import PatientDashboard from "../pages/patient/PatientDashboard";
import UserProfilePage from "../pages/patient/UserProfilePage";
import ChangePasswordPage from "../pages/patient/ChangePasswordPage";
import ExamHistoryPage from "../pages/patient/ExamHistoryPage";
import ExamDetailPage from "../pages/patient/ExamDetailPage";
import BookingAppointmentPage from "../pages/patient/BookingAppointmentPage";
import PaymentPage from "../pages/patient/PaymentPage";
import UnderMyCarePage from "../pages/patient/UnderMyCarePage";
import KeyCodePage from "../pages/patient/KeyCodePage";

const patientRoutes = [
    { path: '/patient/dashboard', element: <PatientDashboard /> },
    { path: '/patient/profile', element: <UserProfilePage /> },
    { path: '/patient/change-password', element: <ChangePasswordPage /> },
    { path: '/patient/exam-history', element: <ExamHistoryPage /> },
    { path: '/patient/exam/:id', element: <ExamDetailPage /> },
    { path: '/patient/booking', element: <BookingAppointmentPage /> },
    { path: '/patient/payment/:id', element: <PaymentPage /> },
    { path: '/patient/under-my-care', element: <UnderMyCarePage /> },
    { path: '/patient/under-my-care/key', element: <KeyCodePage /> },
];

export default patientRoutes;