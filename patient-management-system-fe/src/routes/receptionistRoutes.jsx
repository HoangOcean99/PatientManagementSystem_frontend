import ProtectedRoute from "../components/security/ProtectedRoute";

import Dashboard from "../pages/receptionistPage/Dashboard";
import Coordinator from "../pages/receptionistPage/Coordinator";
import ReceptionistProfile from "../pages/receptionistPage/receptionistProfile";
import QueuePatientDashboard from "../pages/receptionistPage/QueuePatientDashboard";

const receptionistRoutes = [
    {
        path: "/receptionist/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Dashboard />
            </ProtectedRoute>
        )
    },
    {
        path: "/receptionist/coordinator",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Coordinator />
            </ProtectedRoute>
        )
    },
    {
        path: "/receptionist/profile",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistProfile />
            </ProtectedRoute>
        )
    },
    {
        path: "/receptionist/queue-patient-dashboard",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <QueuePatientDashboard />
            </ProtectedRoute>
        )
    }
];

export default receptionistRoutes;