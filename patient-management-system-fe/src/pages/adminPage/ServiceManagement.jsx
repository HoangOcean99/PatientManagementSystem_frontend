import React, { useState } from 'react';
import * as Icons from "lucide-react";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { ItemsAdminSideBar } from '../../components/sidebar/ItemsAdminSideBar';
import { useNavigate } from 'react-router-dom';
import DynamicModal from '../../components/common/DynamicModal';

const servicesData = [
    {
        id: 1,
        key: "kham-tong-quat",
        name: "Khám Tổng Quát",
        desc: "Kiểm tra sức khỏe định kỳ và tư vấn tổng quát.",
        duration: "30 phút",
        status: "Hoạt động",
        color: "bg-blue-500",
        icon: "Stethoscope"
    },
    {
        id: 2,
        key: "tim-mach",
        name: "Tim Mạch",
        desc: "Chẩn đoán và điều trị các bệnh về tim và mạch máu.",
        duration: "45 phút",
        status: "Hoạt động",
        color: "bg-red-500",
        icon: "HeartPulse"
    },
    {
        id: 3,
        key: "da-lieu",
        name: "Da Liễu",
        desc: "Chăm sóc và điều trị các vấn đề về da, tóc, móng.",
        duration: "30 phút",
        status: "Bảo trì",
        color: "bg-orange-500",
        icon: "Sparkles"
    },
    {
        id: 4,
        key: "nhi-khoa",
        name: "Nhi Khoa",
        desc: "Khám và điều trị bệnh cho trẻ em và sơ sinh.",
        duration: "30 phút",
        status: "Hoạt động",
        color: "bg-green-500",
        icon: "Baby"
    },
    {
        id: 5,
        key: "chan-thuong",
        name: "Chấn Thương",
        desc: "Phẫu thuật và điều trị các vấn đề về xương khớp.",
        duration: "60 phút",
        status: "Hoạt động",
        color: "bg-purple-500",
        icon: "Bone"
    },
    {
        id: 6,
        key: "than-kinh",
        name: "Thần Kinh",
        desc: "Chẩn đoán và điều trị bệnh liên quan đến hệ thần kinh.",
        duration: "45 phút",
        status: "Hoạt động",
        color: "bg-indigo-500",
        icon: "Brain"
    }
]
const userFields = [
    {
        name: "fullName",
        label: "Họ tên",
        type: "text",
        required: true
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true
    },
    {
        name: "role",
        label: "Vai trò",
        type: "select",
        options: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" }
        ]
    }
];

const ServiceCard = ({ service }) => {
    const Icon = Icons[service.icon] || Icons.Activity;
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/admin/service-detail/${service.key}`)}
            className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden cursor-pointer"
        >
            {/* Background Decor */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${service.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${service.color} text-white shadow-lg shadow-inherit/20`}>
                    <Icon size={24} />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Icons.Edit3 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Icons.Trash2 size={18} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2 italic">
                "{service.desc}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400">
                    <Icons.Clock size={14} />
                    <span className="text-xs font-semibold">{service.duration}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${service.status === 'Hoạt động' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {service.status}
                </span>
            </div>
        </div>
    );
};

const ServiceManagement = () => {
    const [filter, setFilter] = useState('Tất cả');
    const [isShowServiceCreatePopUp, setIsShowServiceCreatePopUp] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={ItemsAdminSideBar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">            {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Danh mục Dịch vụ</h1>
                            <p className="text-gray-500 mt-1 font-medium">Quản lý và tùy chỉnh các gói dịch vụ y tế của phòng khám.</p>
                        </div>
                        <button
                            onClick={() => setIsShowServiceCreatePopUp(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <Icons.Plus size={20} />
                            Thêm dịch vụ mới
                        </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên dịch vụ hoặc mô tả..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                            {['Tất cả', 'Hoạt động', 'Bảo trì'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setFilter(item)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === item ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicesData.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}

                        {/* Empty State / Add Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                            <div className="p-4 bg-gray-50 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <Icons.Plus size={32} />
                            </div>
                            <p className="mt-4 font-bold text-sm">Tạo thêm dịch vụ chuyên khoa</p>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-sm text-gray-400">Hiển thị 6 trên 12 dịch vụ</span>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><Icons.ChevronLeft size={18} /></button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-100">1</button>
                            <button className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-bold">2</button>
                            <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><Icons.ChevronRight size={18} /></button>
                        </div>
                    </div>
                </main>
            </div>

            {isShowServiceCreatePopUp && <DynamicModal
                title="Thêm người dùng"
                fields={userFields}
                onSubmit={(data) => console.log(data)}
                onClose={() => setIsShowServiceCreatePopUp(false)}
            />}
        </div>
    );
};

export default ServiceManagement;