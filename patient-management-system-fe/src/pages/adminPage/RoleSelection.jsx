import React from 'react';
import * as Icons from "lucide-react";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { ItemsAdminSideBar } from '../../components/sidebar/ItemsAdminSideBar';
import { useNavigate } from 'react-router-dom';

const roles = [
    {
        id: 'admin',
        title: 'Quản trị viên',
        desc: 'Quản lý toàn bộ hệ thống, người dùng và dịch vụ.',
        icon: 'ShieldCheck',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        id: 'doctor',
        title: 'Bác sĩ',
        desc: 'Xem lịch khám, quản lý bệnh nhân và hồ sơ y tế.',
        icon: 'Stethoscope',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        id: 'receptionist',
        title: 'Lễ tân',
        desc: 'Tiếp đón khách, sắp xếp lịch hẹn và điều phối.',
        icon: 'UserPlus',
        color: 'bg-green-100 text-green-600',
    },
    {
        id: 'accountant',
        title: 'Kế toán',
        desc: 'Quản lý hóa đơn, doanh thu và báo cáo tài chính.',
        icon: 'Wallet',
        color: 'bg-orange-100 text-orange-600',
    },
    {
        id: 'patient',
        title: 'Bệnh nhân',
        desc: 'Đặt lịch khám, xem kết quả và lịch sử điều trị.',
        icon: 'User',
        color: 'bg-red-100 text-red-600',
    },
];


const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={ItemsAdminSideBar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/30 p-10">
                    <div className="mx-auto w-full flex flex-col items-center">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 w-full">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-bold text-gray-800">Xác nhận vai trò</h1>
                                </div>
                                <p className="text-gray-500 mt-1 font-medium">
                                    Vui lòng chọn vai trò của bạn để tiếp tục truy cập vào hệ thống.
                                </p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full justify-items-center">
                            {roles.map((role) => {
                                const Icon = Icons[role.icon];
                                return (
                                    <div
                                        key={role.id}
                                        onClick={() => navigate(`/admin/user-management/${role.id}`)}
                                        className="bg-white w-full max-w-[320px] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center"
                                    >
                                        <div className={`p-5 rounded-2xl mb-5 transition-transform group-hover:scale-110 shadow-inner ${role.color}`}>
                                            <Icon size={36} />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-xl mb-3">{role.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed h-12">
                                            {role.desc}
                                        </p>
                                        <div className="mt-8 flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            Truy cập ngay <Icons.ChevronRight size={18} className="ml-1" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="mt-16 text-gray-400 text-sm">
                            Bạn gặp khó khăn khi đăng nhập? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Liên hệ hỗ trợ</span>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RoleSelection;