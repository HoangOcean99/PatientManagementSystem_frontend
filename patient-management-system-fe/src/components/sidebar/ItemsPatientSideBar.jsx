export const ItemsPatientSideBar = [
    {
        icon: 'LayoutDashboard',
        label: "Tổng quan",
        linkPage: "/patient/dashboard",
        matchPages: [
            "/patient/dashboard"
        ]
    },
    {
        icon: 'User',
        label: "Hồ sơ cá nhân",
        linkPage: "/patient/profile",
        matchPages: [
            "/patient/profile",
            "/patient/change-password"
        ]
    },
    {
        icon: 'Calendar',
        label: "Đặt lịch khám",
        linkPage: "/patient/booking",
        matchPages: [
            "/patient/booking"
        ]
    },
    {
        icon: 'Clock',
        label: "Lịch hẹn đã lỡ",
        linkPage: "/patient/missed-appointments",
        matchPages: [
            "/patient/missed-appointments"
        ]
    },
    {
        icon: 'CreditCard',
        label: "Thanh toán",
        linkPage: "/patient/billing",
        matchPages: [
            "/patient/billing"
        ]
    },
    {
        icon: 'FileText',
        label: "Kết quả bệnh án",
        linkPage: "/patient/medical-records",
        matchPages: [
            "/patient/medical-records"
        ]
    },
    {
        icon: 'Users',
        label: "Chăm sóc người thân",
        linkPage: "/patient/under-my-care",
        matchPages: [
            "/patient/under-my-care",
            "/patient/under-my-care/key"
        ]
    },
];