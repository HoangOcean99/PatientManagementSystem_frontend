import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';



const PaymentPage = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const appointment = location.state?.appointment;
    const service = location.state?.service;

    const [submitting, setSubmitting] = useState(false);

    const handlePay = async () => {
        try {
            setSubmitting(true);
            toast.success('Xác nhận đặt cọc thành công!');
            navigate('/patient/booking');
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
                            <div className="flex justify-between items-center py-3 border-t-2 border-gray-100 mt-2">
                                <span className="text-base font-bold text-gray-800">Tổng tiền</span>
                                <span className="text-xl font-extrabold text-blue-600">{Number(service?.price * 0.3 || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm shadow-lg shadow-emerald-500/25">
                                    <i className="fa-solid fa-qrcode"></i>
                                </span>
                                Quét mã QR để đặt cọc
                            </h3>
                        </div>
                        <div className="p-6 text-center">
                            <div className="w-48 h-48 mx-auto bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-6 shadow-sm relative">
                                <i className="fa-solid fa-qrcode text-7xl text-gray-300"></i>
                                <div className="absolute inset-0 bg-[url('/qrBank.jpg')] bg-cover bg-center bg-no-repeat rounded-xl"></div>
                            </div>
                            <div className="w-full max-w-sm mx-auto text-left bg-rose-50 border border-rose-100 rounded-xl p-4">
                                <p className="text-xs font-semibold text-rose-600 mb-1.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-info"></i> Lưu ý quan trọng
                                </p>
                                <p className="text-sm text-rose-800 leading-relaxed">
                                    Vui lòng ghi rõ nội dung chuyển khoản: <br />
                                    <span className="font-bold text-rose-900 bg-rose-100/50 px-2 py-1 rounded uppercase mt-2 inline-block text-base tracking-widest">
                                        DAT COC {appointmentId.slice(0, 8)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button onClick={() => navigate('/patient/dashboard')} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer">
                            <i className="fa-solid fa-xmark mr-2"></i> Hủy
                        </button>
                        <button
                            onClick={handlePay}
                            disabled={submitting}
                            className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            {submitting ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý...</>
                            ) : (
                                <><i className="fa-solid fa-lock"></i> Xác nhận đã đặt cọc</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default PaymentPage;
