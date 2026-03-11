import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const INVOICE_STATUS = {
    unpaid: { label: 'Chưa trả', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
    partial: { label: 'Trả một phần', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    paid: { label: 'Đã trả', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    refunded: { label: 'Đã hoàn', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
};

const PAY_METHOD_LABEL = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    credit_card: 'Thẻ tín dụng',
};

const BillingPage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                if (!userId) return;

                const res = await axiosClient.get('/invoices', { params: { patient_id: userId } });
                const fetchedInvoices = res.data?.data || res.data || [];
                setInvoices(fetchedInvoices);
                if (fetchedInvoices.length > 0) {
                    setSelectedId(fetchedInvoices[0].invoice_id);
                }
            } catch (err) {
                console.error('Failed to load invoices:', err);
                toast.error('Không thể tải danh sách hóa đơn');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = filter === 'all' ? invoices : invoices.filter(i => i.payment_status === filter);
    const selected = invoices.find(i => i.invoice_id === selectedId) || null;

    const formatCurrency = (n) => Number(n).toLocaleString('vi-VN') + ' đ';
    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Thanh toán</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Thanh toán viện phí</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left — Invoice List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Danh sách hóa đơn</h3>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="text-xs font-semibold text-sky-600 bg-transparent border-none outline-none cursor-pointer"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="unpaid">Chưa trả</option>
                                    <option value="partial">Trả một phần</option>
                                    <option value="paid">Đã trả</option>
                                </select>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {filtered.map((inv) => {
                                    const st = INVOICE_STATUS[inv.payment_status] || INVOICE_STATUS.unpaid;
                                    const isSelected = inv.invoice_id === selectedId;
                                    return (
                                        <div
                                            key={inv.invoice_id}
                                            onClick={() => setSelectedId(inv.invoice_id)}
                                            className={`px-6 py-4 cursor-pointer transition-all ${isSelected
                                                ? 'bg-sky-50/60 border-l-4 border-l-sky-500'
                                                : 'hover:bg-gray-50/80 border-l-4 border-l-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-gray-800 text-sm truncate max-w-[140px]">
                                                    {inv.Appointment?.ClinicService?.name || inv.invoice_id.slice(0, 8)}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{formatDate(inv.issued_at)}</span>
                                                <span className="font-bold text-sky-600 text-sm">{formatCurrency(inv.total_amount)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Invoice Detail */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        {selected ? (
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Chi tiết hóa đơn</h3>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Mã hóa đơn: </span>
                                            <span className="font-bold text-gray-800">{selected.invoice_id.slice(0, 8)}...</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Ngày phát hành: </span>
                                            <span className="font-bold text-gray-800">{formatDate(selected.issued_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Bác sĩ: </span>
                                            <span className="font-bold text-gray-800">{selected.Appointment?.Doctor?.User?.full_name || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phương thức: </span>
                                            <span className="font-bold text-gray-800">{PAY_METHOD_LABEL[selected.payment_method] || selected.payment_method}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Service table — uses InvoiceItems fields */}
                                <div className="px-6 py-5">
                                    <h4 className="text-base font-bold text-gray-800 mb-4">Bảng kê chi tiết dịch vụ</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 font-semibold text-gray-500">Dịch vụ</th>
                                                    <th className="text-center py-3 font-semibold text-gray-500">Số lượng</th>
                                                    <th className="text-right py-3 font-semibold text-gray-500">Đơn giá</th>
                                                    <th className="text-right py-3 font-semibold text-gray-500">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(selected.InvoiceItems || []).map((item) => (
                                                    <tr key={item.item_id} className="border-b border-gray-50">
                                                        <td className="py-3 text-gray-700">{item.item_name}</td>
                                                        <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                                        <td className="py-3 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                                                        <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(item.subtotal)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-100">
                                        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                                        <span className="text-2xl font-extrabold text-red-500">{formatCurrency(selected.total_amount)}</span>
                                    </div>
                                </div>

                                {/* QR Section */}
                                <div className="px-6 pb-6">
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                        <p className="font-bold text-gray-700 mb-4">Quét mã QR để thanh toán</p>
                                        <div className="w-32 h-32 mx-auto bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                                            <i className="fa-solid fa-qrcode text-5xl text-gray-300"></i>
                                        </div>
                                        <button
                                            className="w-full max-w-xs mx-auto py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                                            style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }}
                                        >
                                            <i className="fa-solid fa-wallet"></i>
                                            Thanh toán ngay
                                        </button>
                                        <p className="text-xs text-gray-400 mt-3">Sử dụng ứng dụng ngân hàng hoặc ví điện tử của bạn để quét mã.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100/30 p-12 text-center">
                                <i className="fa-solid fa-receipt text-4xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500 font-medium">Chọn một hóa đơn để xem chi tiết</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
