import ProtectedRoute from "../components/security/ProtectedRoute";

import Dashboard from "../pages/receptionistPage/Dashboard";
import Coordinator from "../pages/receptionistPage/Coordinator";

const receptionistRoutes = [
    {
        path: "/receptionist/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Dashboard />
            </ProtectedRoute>)

    },
    {
        path: "/receptionist/coordinator",
        element: (
            <ProtectedRoute allowedRoles={["receptionist"]}>
                <Coordinator />
            </ProtectedRoute>
        )
    },


];

export default receptionistRoutes;