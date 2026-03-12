import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

// appt_status enum from DB: pending | confirmed | checked_in | in_progress | completed | cancelled | missed
const PROGRESS_STEPS = [
    { key: 'pending', label: 'Đã lên lịch', icon: 'fa-calendar-check' },
    { key: 'checked_in', label: 'Đã check-in', icon: 'fa-right-to-bracket' },
    { key: 'in_progress', label: 'Đang khám', icon: 'fa-comments' },
    { key: 'completed', label: 'Đã hoàn thành', icon: 'fa-circle-check' },
];

// lab_status enum from DB
const LAB_STATUS = {
    ordered: { label: 'Đã yêu cầu', color: 'text-amber-600', bg: 'bg-amber-100' },
    processing: { label: 'Đang chờ', color: 'text-gray-600', bg: 'bg-gray-100' },
    completed: { label: 'Hoàn thành', color: 'text-white', bg: 'bg-sky-500' },
};

const AppointmentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get(`/appointment/${id}`);
                const data = res.data?.data || res.data;
                setAppointment(data);
            } catch (err) {
                console.error('Failed to load appointment:', err);
                toast.error('Không thể tải chi tiết lịch hẹn');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            load();
        } else {
            setLoading(false);
        }
    }, [id]);

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatCurrency = (n) => Number(n).toLocaleString('vi-VN') + ' VND';

    const getProgressIndex = (status) => {
        return PROGRESS_STEPS.findIndex(s => s.key === status);
    };

    if (loading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex-1 h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <div className="text-center">
                    <i className="fa-solid fa-calendar-xmark text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">Không tìm thấy lịch hẹn</p>
                    <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold hover:underline cursor-pointer">← Quay lại</button>
                </div>
            </div>
        );
    }

    const progressIdx = getProgressIndex(appointment.status);
    const record = appointment.MedicalRecord;
    const invoice = appointment.Invoice;
    const invoiceItems = invoice?.InvoiceItems || [];
    const prescriptions = record?.Prescriptions || [];
    const labOrders = record?.LabOrders || [];
    const totalCost = invoice?.total_amount || appointment.total_price || 0;

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h1 className="text-xl font-extrabold text-gray-900">Chi tiết lịch hẹn</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* Top Row: Appointment Info + Doctor Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        {/* Appointment Info */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                                    <i className="fa-solid fa-calendar-day text-sky-500 text-sm"></i>
                                </span>
                                Thông tin lịch hẹn
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-500">Dịch vụ:</p>
                                <p className="font-bold text-gray-800">{appointment.ClinicService?.name || '—'}</p>
                                <div className="flex items-center gap-2 text-gray-600 mt-2">
                                    <i className="fa-regular fa-calendar text-sky-400"></i>
                                    <span>{formatDate(appointment.DoctorSlot?.slot_date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <i className="fa-regular fa-clock text-sky-400"></i>
                                    <span>{appointment.DoctorSlot?.start_time} — {appointment.DoctorSlot?.end_time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="bg-sky-50/60 backdrop-blur-sm rounded-2xl border border-sky-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                                    <i className="fa-solid fa-user-doctor text-sky-600 text-sm"></i>
                                </span>
                                Thông tin bác sĩ
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
                                    {(appointment.Doctor?.User?.full_name || '?').split(' ').slice(-1)[0][0]}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{appointment.Doctor?.User?.full_name || '—'}</p>
                                    <p className="text-sm text-gray-500">{appointment.Doctor?.specialization || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-5">
                        <h3 className="text-base font-bold text-gray-800 mb-6">Tiến độ lịch hẹn</h3>
                        <div className="flex items-center justify-between relative">
                            {/* Line */}
                            <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 rounded-full"></div>
                            <div className="absolute top-5 left-8 h-1 bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${(progressIdx / (PROGRESS_STEPS.length - 1)) * (100 - 12)}%` }}></div>

                            {PROGRESS_STEPS.map((step, idx) => {
                                const isDone = idx <= progressIdx;
                                const isCurrent = idx === progressIdx;
                                return (
                                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                            : 'bg-gray-100 text-gray-400'
                                            } ${isCurrent ? 'ring-4 ring-sky-200' : ''}`}>
                                            <i className={`fa-solid ${step.icon} text-sm`}></i>
                                        </div>
                                        <span className={`text-xs font-semibold ${isDone ? 'text-sky-600' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Middle Row: Doctor Notes + Lab Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        {/* Doctor Notes */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3">Ghi chú/Quan sát của bác sĩ</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{record?.doctor_notes || '—'}</p>
                        </div>

                        {/* Lab Results — uses LabOrders fields */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3">Kết quả xét nghiệm/kiểm tra</h3>
                            <div className="space-y-3">
                                {labOrders.map((lab) => {
                                    const st = LAB_STATUS[lab.status] || LAB_STATUS.ordered;
                                    return (
                                        <div key={lab.lab_order_id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                                                <i className="fa-solid fa-flask text-gray-400 text-xs"></i>
                                            </div>
                                            <span className="flex-1 text-sm font-semibold text-gray-700">{lab.test_name}</span>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
                                                {st.label}
                                            </span>
                                            {lab.result_file_url && (
                                                <a href={lab.result_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-sky-600 cursor-pointer flex items-center gap-1">
                                                    <i className="fa-solid fa-file-arrow-down text-[10px]"></i>
                                                    Tải báo cáo
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Diagnosis + Prescriptions */}
                    {(record?.diagnosis || prescriptions.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        {/* Diagnosis */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3">Chẩn đoán/Kết luận</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{record?.diagnosis || 'Chưa có chẩn đoán'}</p>
                        </div>

                        {/* Prescriptions — uses Prescriptions fields */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3">Danh sách thuốc được kê</h3>
                            {prescriptions.length === 0 ? (
                                <p className="text-sm text-gray-500">Không có đơn thuốc.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-2 font-semibold text-gray-500 text-xs">Thuốc</th>
                                                <th className="text-left py-2 font-semibold text-gray-500 text-xs">Liều lượng</th>
                                                <th className="text-left py-2 font-semibold text-gray-500 text-xs">Hướng dẫn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.map((p) => (
                                                <tr key={p.prescription_id} className="border-b border-gray-50">
                                                    <td className="py-2.5 text-gray-700 font-medium">{p.medication_name}</td>
                                                    <td className="py-2.5 text-gray-600">{p.dosage}</td>
                                                    <td className="py-2.5 text-gray-500">{p.instructions}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Costs — uses InvoiceItems */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-5">
                        <h3 className="text-base font-bold text-gray-800 mb-3">Chi phí khám bệnh</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 font-semibold text-gray-500">Dịch vụ</th>
                                        <th className="text-center py-2 font-semibold text-gray-500">SL</th>
                                        <th className="text-right py-2 font-semibold text-gray-500">Đơn giá</th>
                                        <th className="text-right py-2 font-semibold text-gray-500">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceItems.map((c) => (
                                        <tr key={c.item_id} className="border-b border-gray-50">
                                            <td className="py-2.5 text-gray-700">{c.item_name}</td>
                                            <td className="py-2.5 text-center text-gray-600">{c.quantity}</td>
                                            <td className="py-2.5 text-right text-gray-600">{formatCurrency(c.unit_price)}</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-800">{formatCurrency(c.subtotal)}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2 border-gray-100">
                                        <td colSpan={3} className="py-3 font-bold text-gray-800">Tổng cộng</td>
                                        <td className="py-3 text-right font-extrabold text-red-500 text-lg">{formatCurrency(totalCost)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                        <button className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }}>
                            <i className="fa-solid fa-file-arrow-down"></i>
                            Tải báo cáo
                        </button>
                        <button className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <i className="fa-solid fa-phone"></i>
                            Liên hệ bác sĩ
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Trở về danh sách lịch
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default AppointmentDetailPage;
