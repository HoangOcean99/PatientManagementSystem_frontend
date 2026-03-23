import React, { useState, useEffect } from 'react';
import { Users, Calendar, Heart, UserCheck, CalendarDays, Briefcase, DollarSign, Activity, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


import { getAdminDashboardStats } from '../../api/dashboardApi';

const formatCurrency = (n) => Number(n).toLocaleString('vi-VN') + ' đ';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalUsers: 0,
        pendingAppointments: 0,
        totalServices: 0,
        monthlyRevenue: 0,
        popularService: 'Đang tải...'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminDashboardStats();
                if (res?.data?.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Chào mừng trở lại, Administrator!</h1>
                <p className="text-gray-500 mt-1 font-medium">Tổng quan về hệ thống và dữ liệu cập nhật theo thời gian thực.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng số bệnh nhân" value={loading ? '...' : stats.totalPatients} subtext="Hồ sơ bệnh nhân" icon={Heart} iconColor="bg-red-400" />
                <StatCard title="Người dùng hoạt động" value={loading ? '...' : stats.totalUsers} subtext="Toàn bộ tài khoản" icon={UserCheck} iconColor="bg-blue-400" />
                <StatCard title="Cuộc hẹn đang chờ" value={loading ? '...' : stats.pendingAppointments} subtext="Cần được xử lý/xác nhận" icon={CalendarDays} iconColor="bg-gray-800" />
                <StatCard title="Dịch vụ đã cung cấp" value={loading ? '...' : stats.totalServices} subtext="Các dịch vụ đang hoạt động" icon={FileText} iconColor="bg-gray-800" />
                <StatCard title="Doanh thu trong tháng" value={loading ? '...' : formatCurrency(stats.monthlyRevenue)} subtext="Dựa trên hóa đơn đã thanh toán" icon={DollarSign} iconColor="bg-emerald-500" />
                <StatCard title="Dịch vụ phổ biến" value={loading ? '...' : stats.popularService} subtext="Nhiều người quan tâm nhất" icon={Briefcase} iconColor="bg-blue-500" />
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Các chức năng theo phân hệ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionCard title="Quản lý người dùng" desc="Thêm, sửa, xóa người dùng và quyền." icon={Users} link={'/admin/role-selection'} />
                    <ActionCard title="Thiết lập lịch trình" desc="Cấu hình lịch trình chung cho hệ thống." icon={Calendar} link={'/admin/schedule-management'} />
                    <ActionCard title="Quản lý dịch vụ" desc="Dịch vụ phòng khám và xét nghiệm." icon={Briefcase} link={'/admin/service-management'} />
                    <ActionCard title="Tài khoản admin" desc="Xem và thay đổi thông tin Admin." icon={User} link={'/admin/admin-profile'} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Trạng thái hệ thống máy chủ (24h)</h4>
                <div className="flex gap-2">
                    <div className="h-2 flex-grow bg-red-400 rounded-full" title="Critical" style={{ width: '5%' }}></div>
                    <div className="h-2 flex-grow bg-amber-400 rounded-full" title="Warning" style={{ width: '15%' }}></div>
                    <div className="h-2 flex-grow bg-blue-400 rounded-full" title="Info" style={{ width: '80%' }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                    <span>Lỗi hệ thống (5%)</span>
                    <span>Cảnh báo (15%)</span>
                    <span>Bình thường (80%)</span>
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


const ActionCard = ({ title, desc, icon: Icon, link }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3">
                <Icon size={20} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{title}</h4>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">{desc}</p>
            <button onClick={() => navigate(link)} className="px-4 py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-colors">
                Xem thêm
            </button>
        </div>
    )
}

export default AdminDashboard;