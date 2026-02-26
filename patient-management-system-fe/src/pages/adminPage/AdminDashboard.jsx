import React from 'react';
import { Users, Calendar, Heart, UserCheck, CalendarDays, Briefcase, DollarSign, Activity, FileText } from 'lucide-react';


const AdminDashboard = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Chào mừng trở lại, Administrator!</h1>
                <p className="text-gray-500 mt-1 font-medium">Tổng quan về hệ thống quản lý bệnh nhân của bạn.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng số bệnh nhân" value="2,450" subtext="Tăng 12% so với tháng trước" icon={Heart} iconColor="bg-red-400" />
                <StatCard title="Người dùng hoạt động" value="1,200" subtext="Tăng 5% so với tuần trước" icon={UserCheck} iconColor="bg-blue-400" />
                <StatCard title="Cuộc hẹn đang chờ" value="15" subtext="Cần xác nhận trong hôm nay" icon={CalendarDays} iconColor="bg-gray-800" />
                <StatCard title="Dịch vụ đã cung cấp" value="8" subtext="Đang hoạt động trong hệ thống" icon={FileText} iconColor="bg-gray-800" />
                <StatCard title="Doanh thu hàng tháng" value="$12,500" subtext="Tăng 8% so với tháng trước" icon={DollarSign} iconColor="bg-green-500" />
                <StatCard title="Dịch vụ phổ biến" value="Khám tổng quát" subtext="Dịch vụ được yêu thích nhất" icon={Briefcase} iconColor="bg-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Hoạt động gần đây</h3>
                    <div className="space-y-6">
                        <ActivityItem text='Tài khoản admin "John Doe" đã đăng nhập.' time="2 phút trước" />
                        <ActivityItem text='Thêm bệnh nhân mới "Nguyễn Văn A".' time="1 giờ trước" />
                        <ActivityItem text='Cập nhật lịch khám cho bệnh nhân "Trần Thị B".' time="3 giờ trước" />
                        <ActivityItem text='Đã hoàn thành cuộc hẹn với "Lê Văn C".' time="Hôm qua" />
                        <ActivityItem text='Tin nhắn mới từ bộ phận hỗ trợ.' time="Hôm qua" />
                    </div>
                </div>

                <div className="space-y-4">
                    <ActionCard title="Quản lý người dùng" desc="Thêm, sửa, xóa người dùng và quản lý quyền truy cập." icon={Users} />
                    <ActionCard title="Thiết lập lịch trình" desc="Cấu hình lịch trình chung cho hệ thống." icon={Calendar} />
                    <ActionCard title="Quản lý dịch vụ" desc="Thêm, sửa, xóa và cập nhật các dịch vụ y tế." icon={Briefcase} />
                    <ActionCard title="Xem báo cáo" desc="Tổng quan về hệ thống bệnh nhân và dịch vụ." icon={Activity} />
                </div>
            </div>
        </main>
    );
};

const StatCard = ({ title, value, subtext, icon: Icon, iconColor }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${iconColor} text-white`}>
                <Icon size={18} />
            </div>
        </div>
        <p className="text-[11px] text-gray-400">{subtext}</p>
    </div>
);

const ActivityItem = ({ text, time }) => (
    <div className="flex justify-between items-center text-sm">
        <div className="flex gap-3 items-center text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>{text}</span>
        </div>
        <span className="text-gray-400 text-xs">{time}</span>
    </div>
);

const ActionCard = ({ title, desc, icon: Icon }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3">
            <Icon size={20} />
        </div>
        <h4 className="font-bold text-gray-800 text-sm mb-1">{title}</h4>
        <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">{desc}</p>
        <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-colors">
            Xem thêm
        </button>
    </div>
);

export default AdminDashboard;