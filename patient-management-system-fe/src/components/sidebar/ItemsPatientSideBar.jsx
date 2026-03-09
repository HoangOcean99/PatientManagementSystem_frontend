export const ItemsPatientSideBar = [
    {
        icon: 'LayoutDashboard',
        label: "Dashboard",
        linkPage: "/patient/dashboard",
        matchPages: [
            "/patient/dashboard"
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
        icon: 'FileText',
        label: "Lịch sử khám",
        linkPage: "/patient/exam-history",
        matchPages: [
            "/patient/exam-history",
            "/patient/exam"
        ]
    },
    {
        icon: 'Users',
        label: "Người được tôi quản lý",
        linkPage: "/patient/under-my-care",
        matchPages: [
            "/patient/under-my-care",
            "/patient/under-my-care/key"
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
    }
];