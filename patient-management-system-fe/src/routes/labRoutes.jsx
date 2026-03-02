import ProtectedRoute from '../components/security/ProtectedRoute';

import LabQueuePage from "../pages/labPage/LabQueuePage";
import LabResultPage from "../pages/labPage/LabResultPage";
import LabProfilePage from "../pages/labPage/LabProfilePage";

const labRoutes = [
    {
        path: '/lab/queue',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabQueuePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/lab/result/:labOrderId',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabResultPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/lab/profile',
        element: (
            <ProtectedRoute allowedRoles={["lab"]}>
                <LabProfilePage />
            </ProtectedRoute>
        )
    },
];

export default labRoutes;