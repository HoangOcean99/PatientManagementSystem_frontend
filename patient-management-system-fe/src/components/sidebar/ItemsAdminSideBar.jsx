export const ItemsAdminSideBar = [
    {
        icon: "LayoutDashboard",
        label: "Bảng điều khiển",
        linkPage: '/admin/dashboard',
        matchPages: [
            '/admin/dashboard'
        ]
    },
    {
        icon: "Users",
        label: "Quản lý người dùng",
        linkPage: '/admin/role-selection',
        matchPages: [
            '/admin/role-selection',
            '/admin/user-management',
            '/admin/user-profile',
            '/admin/user-profile-edit',
        ]
    },
    {
        icon: "Calendar",
        label: "Thiết lập lịch trình",
        linkPage: '/admin/schedule-management',
        matchPages: [
            '/admin/schedule-management'
        ]
    },
    {
        icon: "Briefcase",
        label: "Quản lý dịch vụ",
        linkPage: '/admin/service-management',
        matchPages: [
            '/admin/service-management',
            '/admin/service-detail',
        ]
    },
    {
        icon: "UserCircle",
        label: "Quản lý tài khoản admin",
        linkPage: '/admin/admin-profile',
        matchPages: [
            '/admin/admin-profile'
        ]
    },
];