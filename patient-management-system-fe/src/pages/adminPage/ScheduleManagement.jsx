import React, { useState } from 'react';
import * as Icons from "lucide-react";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { ItemsAdminSideBar } from '../../components/sidebar/ItemsAdminSideBar';

// Component con cho từng dòng cấu hình giờ làm việc
const WorkingDayRow = ({ day, active, start, end }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <span className="text-sm font-medium text-gray-700 w-24">{day}</span>
        <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={active} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <div className="flex gap-2">
                <input type="text" defaultValue={start} className="w-20 px-3 py-1.5 border border-gray-200 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <input type="text" defaultValue={end} className="w-20 px-3 py-1.5 border border-gray-200 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
        </div>
    </div>
);

const ScheduleManagement = () => {
    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={ItemsAdminSideBar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
                    <div className="flex justify-between items-center">
                        <div >
                            <h1 className="text-3xl font-bold text-gray-800">Thiết lập lịch trình toàn cầu</h1>
                            <p className="text-gray-500 mt-1 font-medium">Thiết lập lịch chung và các sự kiện đặc biệt.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
                                <Icons.Save size={18} /> Lưu thay đổi
                            </button>
                            <button className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all">
                                <Icons.Plus size={18} /> Thêm sự kiện mới
                            </button>
                        </div>
                    </div>

                    {/* Top Section: Tổng quan lịch trình (Lịch mini) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-10">
                        <h2 className="font-bold text-gray-800 mb-1">Tổng quan lịch trình</h2>
                        <p className="text-xs text-gray-400 mb-6">Chọn ngày để xem hoặc chỉnh sửa lịch trình.</p>
                        <div className="flex justify-center">
                            {/* Ở đây bạn có thể dùng thư viện react-calendar, đây là giao diện giả lập */}
                            <div className="border border-gray-100 rounded-xl p-4 w-full max-w-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <Icons.ChevronLeft size={18} className="text-gray-400 cursor-pointer" />
                                    <span className="font-bold text-sm text-gray-700">January 2026</span>
                                    <Icons.ChevronRight size={18} className="text-gray-400 cursor-pointer" />
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2">
                                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {[...Array(31)].map((_, i) => (
                                        <div key={i} className={`p-2 rounded-lg cursor-pointer hover:bg-blue-50 ${i + 1 === 26 ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Giờ hoạt động mặc định */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-gray-800 mb-1">Giờ hoạt động mặc định</h2>
                            <p className="text-xs text-gray-400 mb-6">Đặt giờ mở cửa tiêu chuẩn cho mỗi ngày trong tuần.</p>
                            <div className="space-y-1">
                                <WorkingDayRow day="Thứ Hai" active={true} start="08:00" end="17:00" />
                                <WorkingDayRow day="Thứ Ba" active={true} start="08:00" end="17:00" />
                                <WorkingDayRow day="Thứ Tư" active={true} start="08:00" end="17:00" />
                                <WorkingDayRow day="Thứ Năm" active={true} start="08:00" end="17:00" />
                                <WorkingDayRow day="Thứ Sáu" active={true} start="08:00" end="17:00" />
                                <WorkingDayRow day="Thứ Bảy" active={false} start="08:00" end="12:00" />
                                <WorkingDayRow day="Chủ Nhật" active={false} start="00:00" end="00:00" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Ngày lễ và ngoại lệ */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-1">Ngày lễ và ngoại lệ</h2>
                                <p className="text-xs text-gray-400 mb-6">Thêm hoặc xóa các ngày lễ và ngoại lệ khỏi lịch trình.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['01/01/2026', '30/04/2026', '01/05/2026'].map(date => (
                                        <span key={date} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                            {date} <Icons.X size={12} className="cursor-pointer" />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Icons.Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input type="text" placeholder="Chọn ngày" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                                    </div>
                                    <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                        <Icons.Plus size={14} /> Thêm ngày lễ
                                    </button>
                                </div>
                            </div>

                            {/* Sự kiện định kỳ */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-1">Sự kiện định kỳ</h2>
                                <p className="text-xs text-gray-400 mb-6">Thiết lập các sự kiện lặp lại tự động.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Tên sự kiện</label>
                                        <input type="text" placeholder="Ví dụ: Kiểm tra hàng tuần" className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Tần suất</label>
                                            <select className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
                                                <option>Hàng tuần</option>
                                                <option>Hàng tháng</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Thời lượng (phút)</label>
                                            <input type="number" defaultValue="60" className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                                        </div>
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-blue-200 shadow-lg active:scale-95 transition-all">
                                        Lưu sự kiện
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lịch trình hiện tại (Table) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-800 mb-1">Lịch trình hiện tại</h2>
                        <p className="text-xs text-gray-400 mb-6">Tổng quan về tất cả các mục lịch trình đang hoạt động.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        <th className="pb-4">Sự kiện</th>
                                        <th className="pb-4">Ngày</th>
                                        <th className="pb-4">Thời gian</th>
                                        <th className="pb-4">Tình trạng</th>
                                        <th className="pb-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[
                                        { name: 'Cuộc họp nhân viên', date: '15/05/2026', time: '10:00 AM', status: 'Đang hoạt động' },
                                        { name: 'Bảo trì hệ thống', date: '20/05/2026', time: '02:00 PM', status: 'Đang hoạt động' },
                                        { name: 'Ngày quốc khánh', date: '02/09/2026', time: 'Cả ngày', status: 'Ngày lễ' },
                                    ].map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-semibold text-gray-700">{item.name}</td>
                                            <td className="py-4 text-gray-500">{item.date}</td>
                                            <td className="py-4 text-gray-500">{item.time}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Ngày lễ' ? 'text-blue-400 bg-blue-50' : 'text-gray-400'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-blue-600 font-bold text-xs cursor-pointer hover:underline">Chỉnh sửa</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ScheduleManagement;