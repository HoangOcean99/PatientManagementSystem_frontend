import accountantRoutes from "./accountantRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";
import doctorRoutes from "./doctorRoutes";
import labRoutes from "./labRoutes";
import patientRoutes from "./patientRoutes";
import receptionistRoutes from "./receptionistRoutes";

const mainRoutes = [
    ...doctorRoutes,
    ...labRoutes,
    ...patientRoutes,
    ...accountantRoutes,
    ...adminRoutes,
    ...receptionistRoutes
];

export default mainRoutes;