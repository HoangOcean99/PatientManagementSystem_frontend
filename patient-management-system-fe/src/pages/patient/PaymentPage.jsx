import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createPayment } from '../../api/patientApi';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const PAY_METHODS = [
    { value: 'cash', label: 'Tiền mặt', icon: 'fa-money-bill-wave', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { value: 'transfer', label: 'Chuyển khoản', icon: 'fa-building-columns', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { value: 'credit_card', label: 'Thẻ tín dụng', icon: 'fa-credit-card', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
];

const PaymentPage = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const appointment = location.state?.appointment;
    const service = location.state?.service;

    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handlePay = async () => {
        if (!method) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }

        try {
            setSubmitting(true);
            await createPayment({
                appointment_id: appointmentId,
                patient_id: appointment?.patient_id,
                total_amount: service?.price || 0,
                payment_method: method,
                payment_status: method === 'cash' ? 'unpaid' : 'paid',
            });
            toast.success('Thanh toán thành công!');
            navigate('/patient/dashboard');
        } catch (err) {
            console.error('Payment failed:', err);
            toast.error(err.response?.data?.message || 'Thanh toán thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/booking')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Thanh toán</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Xác nhận thanh toán</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto px-4 sm:px-6 py-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* Appointment summary */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm shadow-lg shadow-sky-500/25">
                                    <i className="fa-solid fa-receipt"></i>
                                </span>
                                Thông tin lịch hẹn
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Dịch vụ</span>
                                <span className="text-sm font-bold text-gray-800">{service?.name || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-50">
                                <span className="text-sm text-gray-500">Ngày khám</span>
                                <span className="text-sm font-bold text-gray-800">{formatDate(appointment?.appointment_date)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-50">
                                <span className="text-sm text-gray-500">Thời gian</span>
                                <span className="text-sm font-bold text-gray-800">{appointment?.start_time || '—'} — {appointment?.end_time || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-t-2 border-gray-100 mt-2">
                                <span className="text-base font-bold text-gray-800">Tổng tiền</span>
                                <span className="text-xl font-extrabold text-blue-600">{Number(service?.price || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm shadow-lg shadow-emerald-500/25">
                                    <i className="fa-solid fa-wallet"></i>
                                </span>
                                Phương thức thanh toán
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {PAY_METHODS.map((pm) => (
                                <button
                                    key={pm.value}
                                    type="button"
                                    onClick={() => setMethod(pm.value)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${method === pm.value
                                        ? `${pm.border} ${pm.bg} shadow-sm`
                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${method === pm.value ? pm.bg : 'bg-gray-50'} flex items-center justify-center`}>
                                        <i className={`fa-solid ${pm.icon} ${method === pm.value ? pm.color : 'text-gray-400'}`}></i>
                                    </div>
                                    <span className={`font-bold text-sm ${method === pm.value ? 'text-gray-900' : 'text-gray-600'}`}>{pm.label}</span>
                                    <div className="ml-auto">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === pm.value ? `${pm.border}` : 'border-gray-300'}`}>
                                            {method === pm.value && <div className={`w-2.5 h-2.5 rounded-full ${pm.color.replace('text-', 'bg-')}`}></div>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button onClick={() => navigate('/patient/dashboard')} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer">
                            <i className="fa-solid fa-xmark mr-2"></i> Hủy
                        </button>
                        <button
                            onClick={handlePay}
                            disabled={submitting || !method}
                            className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            {submitting ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý...</>
                            ) : (
                                <><i className="fa-solid fa-lock"></i> Xác nhận thanh toán</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default PaymentPage;
