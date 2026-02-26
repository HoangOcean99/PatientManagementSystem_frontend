import React, { useState } from 'react';
import * as Icons from "lucide-react";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { ItemsAdminSideBar } from '../../components/sidebar/ItemsAdminSideBar';

const EditableField = ({ label, value, name, type = "text", onChange }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            defaultValue={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-300"
        />
    </div>
);

const AdminProfile = () => {
    const [formData, setFormData] = useState({
        fullName: "Nguyễn Văn An",
        jobTitle: "Quản trị hệ thống",
        email: "an.nguyen@healthlink.com",
        phone: "+84 987 654 321",
        address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        dob: "1985-01-01"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Gọi API cập nhật profile tại đây
        console.log("Dữ liệu cập nhật:", formData);
    };

    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={ItemsAdminSideBar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
                    {/* Page Header */}
                    <div className="mx-auto flex justify-between items-center px-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                            <p className="text-gray-500 mt-1 font-medium">Quản lý thông tin định danh của bạn trên hệ thống.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <Icons.Check size={20} />
                            Lưu thông tin
                        </button>
                    </div>

                    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                        {/* Avatar & Status Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <div className="relative group">
                                    <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                                        <Icons.User size={64} className="text-blue-300 translate-y-2" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-blue-600 hover:scale-110 transition-transform">
                                        <Icons.Camera size={16} />
                                    </button>
                                </div>
                                <h3 className="mt-5 font-bold text-gray-800 text-xl">{formData.fullName}</h3>
                                <div className="mt-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-extrabold uppercase rounded-full tracking-widest">
                                    Tài khoản xác thực
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                                <div className="flex gap-3 text-blue-700">
                                    <Icons.Info size={20} className="shrink-0" />
                                    <p className="text-xs leading-relaxed font-medium">
                                        Tài khoản này được liên kết với Google. Các thay đổi về mật khẩu hoặc ảnh đại diện chính có thể cần thực hiện tại trang quản lý tài khoản Google.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="md:col-span-2 border-b border-gray-50 pb-4 mb-2">
                                        <h2 className="text-lg font-bold text-gray-800">Thông tin chi tiết</h2>
                                    </div>

                                    <EditableField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                                    <EditableField label="Chức danh" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />

                                    <div className="md:col-span-2">
                                        <div className="space-y-2 opacity-60">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Địa chỉ Email (Liên kết)</label>
                                            <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-500 flex justify-between items-center">
                                                {formData.email}
                                                <Icons.Lock size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <EditableField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    <EditableField label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />

                                    <div className="md:col-span-2">
                                        <EditableField label="Địa chỉ liên lạc" name="address" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminProfile;