import React from 'react';

const Dashboard = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Tổng quan Hoạt động</h1>
                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
                    <i className="fa-regular fa-calendar text-blue-600"></i>
                    <span className="text-sm font-medium">Thứ Sáu, 27/02/2026</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm">BỆNH NHÂN CHECK-IN</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">128</span>
                        <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-full text-blue-600 text-xl">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100 shadow-sm">
                    <p className="text-gray-500 text-sm">TỔNG LỊCH HẸN HÔM NAY</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">246</span>
                        <div className="bg-pink-100 w-12 h-12 flex items-center justify-center rounded-full text-pink-600 text-xl">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-teal-50/50 p-6 rounded-xl border border-teal-100 shadow-sm">
                    <p className="text-gray-500 text-sm">TỔNG LỊCH HẸN ĐÃ HOÀN TẤT</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">120</span>
                        <div className="bg-teal-100 w-12 h-12 flex items-center justify-center rounded-full text-teal-600 text-xl">
                            <i className="fa-solid fa-stethoscope"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Lịch hẹn Chuyên khoa Sắp tới</h2>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                            <i className="fa-solid fa-filter"></i> Lọc danh sách
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> THÊM LỊCH MỚI
                        </button>
                    </div>
                </div>
                
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">Giờ hẹn</th>
                            <th className="px-6 py-4">Bệnh nhân</th>
                            <th className="px-6 py-4">Chuyên khoa</th>
                            <th className="px-6 py-4">Dịch vụ</th>
                            <th className="px-6 py-4">Bác sĩ</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        <tr>
                            <td className="px-6 py-4 font-semibold text-blue-600">09:00</td>
                            <td className="px-6 py-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                    <i className="fa-solid fa-user"></i>
                                </div> 
                                Nguyễn Đình Tú
                            </td>
                            <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">Nội tổng quát</span></td>
                            <td className="px-6 py-4">Khám sức khỏe định kỳ</td>
                            <td className="px-6 py-4">BS. Lê Văn Tám</td>
                            <td className="px-6 py-4"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">Đã đến</span></td>
                            <td className="px-6 py-4 text-gray-500">
                                {/* Đã thay thế icon mắt và dấu 3 chấm ở đây */}
                                <button className="hover:text-blue-600 transition-colors mr-4" title="Xem chi tiết">
                                    <i className="fa-regular fa-eye text-lg"></i>
                                </button>
                                <button className="hover:text-gray-800 transition-colors" title="Tùy chọn khác">
                                    <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;