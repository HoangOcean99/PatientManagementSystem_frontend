import React from 'react';
import { Users, Calendar, Heart, UserCheck, CalendarDays, Briefcase, DollarSign, Activity, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const SeverityBadge = ({ severity }) => {
    const styles = {
        critical: "bg-red-100 text-red-700 border-red-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${styles[severity] || styles.info}`}>
            {severity}
        </span>
    );
};

const AuditLogItem = ({ log }) => (
    <div className="flex gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg border border-transparent hover:border-gray-100">
        <div className="flex-shrink-0 mt-1">
            {/* Icon thay đổi theo Action type */}
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Activity size={18} />
            </div>
        </div>

        <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{log.actor_name || "Hệ thống"}</span>
                    <span className="text-xs text-gray-400 font-medium px-1.5 py-0.5 bg-gray-50 rounded border">
                        {log.actor_role}
                    </span>
                    <SeverityBadge severity={log.severity} />
                </div>
                <span className="text-xs text-gray-400">{log.created_at}</span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-blue-600">{log.action}</span>: {log.action_detail}
            </p>

            {/* Hiển thị thay đổi dữ liệu nếu có */}
            {(log.old_data || log.new_data) && (
                <div className="mt-2 text-[11px] bg-gray-950 text-gray-300 p-3 rounded-md font-mono overflow-x-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-red-400 mb-1 block underline">Trước:</span>
                            <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
                        </div>
                        <div>
                            <span className="text-emerald-400 mb-1 block underline">Sau:</span>
                            <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);


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
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Nhật ký hệ thống</h3>
                                <p className="text-sm text-gray-500">Theo dõi toàn bộ thay đổi và truy cập</p>
                            </div>
                            <button className="text-sm text-blue-600 font-medium hover:underline">
                                Xem tất cả
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
                            <AuditLogItem
                                log={{
                                    actor_role: 'ADMIN',
                                    action: 'UPDATE_PATIENT',
                                    action_detail: 'Cập nhật thông tin bảo hiểm cho Nguyễn Văn A',
                                    severity: 'warning',
                                    old_data: { insurance_id: "OLD-123" },
                                    new_data: { insurance_id: "NEW-456" },
                                    created_at: '2 phút trước'
                                }}
                            />
                            <AuditLogItem
                                log={{
                                    actor_role: 'ADMIN',
                                    action: 'UPDATE_PATIENT',
                                    action_detail: 'Cập nhật thông tin bảo hiểm cho Nguyễn Văn A',
                                    severity: 'warning',
                                    old_data: { insurance_id: "OLD-123" },
                                    new_data: { insurance_id: "NEW-456" },
                                    created_at: '2 phút trước'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <ActionCard title="Quản lý người dùng" desc="Thêm, sửa, xóa người dùng và quản lý quyền truy cập." icon={Users} link={'/admin/role-selection'} />
                    <ActionCard title="Thiết lập lịch trình" desc="Cấu hình lịch trình chung cho hệ thống." icon={Calendar} link={'/admin/schedule-management'} />
                    <ActionCard title="Quản lý dịch vụ" desc="Thêm, sửa, xóa và cập nhật các dịch vụ y tế." icon={Briefcase} link={'/admin/service-management'} />
                    <ActionCard title="Quản lý tài khoản admin" desc="Quản lý, thêm sửa thông tin tài khoản admin." icon={User} link={'/admin/admin-profile'} />
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Trạng thái hệ thống (24h)</h4>
                        <div className="flex gap-2">
                            <div className="h-2 flex-grow bg-red-400 rounded-full" title="Critical" style={{ width: '5%' }}></div>
                            <div className="h-2 flex-grow bg-amber-400 rounded-full" title="Warning" style={{ width: '15%' }}></div>
                            <div className="h-2 flex-grow bg-blue-400 rounded-full" title="Info" style={{ width: '80%' }}></div>
                        </div>
                    </div>
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