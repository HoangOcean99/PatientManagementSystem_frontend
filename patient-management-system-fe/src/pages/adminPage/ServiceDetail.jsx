import React from 'react';
import * as Icons from "lucide-react";
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { ItemsAdminSideBar } from '../../components/sidebar/ItemsAdminSideBar';
import { useNavigate } from 'react-router-dom';

const DetailCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-3">{title}</h3>
        <div className="space-y-4 pt-1">
            {children}
        </div>
    </div>
);

const InfoItem = ({ icon: Icon, label, value, isTag = false }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-blue-500">
            <Icon size={18} />
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            {isTag ? (
                <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                    {value}
                </span>
            ) : (
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{value}</p>
            )}
        </div>
    </div>
);

const ServiceDetail = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={ItemsAdminSideBar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">            {/* Top Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            <Icons.ArrowLeft size={18} /> Quay lại
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Chi Tiết Dịch Vụ: Tư vấn Tổng quát
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">

                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                <Icons.Edit3 size={18} /> Chỉnh Sửa Dịch Vụ
                            </button>
                            {/* Nút đã được thay đổi từ Lưu trữ sang Bảo trì theo yêu cầu */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                                <Icons.Settings2 size={18} /> Bảo Trì Dịch Vụ
                            </button>
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Thông Tin Cơ Bản */}
                        <DetailCard title="Thông Tin Cơ Bản">
                            <InfoItem icon={Icons.Hash} label="ID Dịch Vụ" value="SVC001" />
                            <InfoItem
                                icon={Icons.FileText}
                                label="Mô Tả"
                                value="Dịch vụ tư vấn y tế tổng quát bao gồm khám sức khỏe định kỳ, đánh giá các triệu chứng thông thường, và giới thiệu chuyên khoa nếu cần. Tập trung vào việc duy trì sức khỏe tổng thể và phòng ngừa bệnh."
                            />
                            <InfoItem icon={Icons.Tag} label="Danh Mục" value="Khám Tổng Quát" isTag />
                            <InfoItem icon={Icons.Activity} label="Trạng Thái" value="Active" isTag />
                        </DetailCard>

                        {/* Giá & Thanh Toán */}
                        <DetailCard title="Giá & Thanh Toán">
                            <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                <InfoItem icon={Icons.DollarSign} label="Chi Phí Cơ Bản" value="" />
                                <span className="text-xl font-bold text-gray-800">500.000 VNĐ</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                <InfoItem icon={Icons.Clock} label="Tần Suất Thanh Toán" value="" />
                                <span className="text-sm font-bold text-gray-700">Mỗi phiên</span>
                            </div>
                            <InfoItem
                                icon={Icons.CreditCard}
                                label="Tùy Chọn Thanh Toán"
                                value="Bảo hiểm y tế, Thanh toán trực tiếp"
                            />
                        </DetailCard>

                        {/* Thời Gian Khả Dụng */}
                        <DetailCard title="Thời Gian Khả Dụng">
                            <InfoItem
                                icon={Icons.CalendarClock}
                                label="Giờ Hoạt Động"
                                value="Thứ Hai - Thứ Sáu, 8:00 AM - 5:00 PM"
                            />
                            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                <InfoItem icon={Icons.Timer} label="Thời Lượng Điển Hình" value="" />
                                <span className="text-sm font-bold text-gray-700">30 phút</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <InfoItem icon={Icons.Users} label="Số Lượng Cuộc Hẹn Tối Đa/Slot" value="" />
                                <span className="text-sm font-bold text-gray-700">1</span>
                            </div>
                        </DetailCard>

                        {/* Tài Nguyên Yêu Cầu */}
                        <DetailCard title="Tài Nguyên Yêu Cầu">
                            <div className="flex justify-between items-start">
                                <InfoItem icon={Icons.UserCheck} label="Nhân Sự Yêu Cầu" value="" />
                                <span className="text-sm font-bold text-gray-700">Bác sĩ Đa khoa</span>
                            </div>
                            <InfoItem
                                icon={Icons.Stethoscope}
                                label="Thiết Bị Yêu Cầu"
                                value="Máy đo huyết áp, Ống nghe"
                            />
                            <InfoItem
                                icon={Icons.DoorOpen}
                                label="Phòng/Cơ Sở Yêu Cầu"
                                value="Phòng khám số 1, Phòng khám số 2"
                            />
                        </DetailCard>

                        {/* Cấu Hình Bổ Sung */}
                        <DetailCard title="Cấu Hình Bổ Sung">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                <InfoItem icon={Icons.History} label="Thời Gian Chuẩn Bị" value="" />
                                <span className="text-sm font-bold text-gray-700">5 phút trước hẹn</span>
                            </div>
                            <InfoItem
                                icon={Icons.ClipboardList}
                                label="Quy Trình Theo Dõi"
                                value="Tùy thuộc vào kết quả tư vấn"
                            />
                        </DetailCard>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServiceDetail;