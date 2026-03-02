import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.newPassword) errs.newPassword = 'Vui lòng nhập mật khẩu mới';
        else if (form.newPassword.length < 6) errs.newPassword = 'Mật khẩu tối thiểu 6 ký tự';
        if (!form.confirmPassword) errs.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            const { error } = await supabase.auth.updateUser({ password: form.newPassword });
            if (error) throw error;
            toast.success('Đổi mật khẩu thành công!');
            navigate('/patient/profile');
        } catch (err) {
            console.error('Change password failed:', err);
            toast.error(err.message || 'Đổi mật khẩu thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const PasswordField = ({ field, label, placeholder, showKey }) => (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-blue-400 text-sm"></i>
                </div>
                <input
                    type={show[showKey] ? 'text' : 'password'}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 pl-11 pr-12 bg-white border ${errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium placeholder-gray-400 shadow-sm`}
                />
                <button
                    type="button"
                    onClick={() => setShow(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <i className={`fa-solid ${show[showKey] ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
            </div>
            {errors[field] && (
                <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                    {errors[field]}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/profile')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Bảo mật</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Đổi mật khẩu</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                <motion.form
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSubmit}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm shadow-lg shadow-amber-500/25">
                                <i className="fa-solid fa-shield-halved"></i>
                            </span>
                            Thay đổi mật khẩu
                        </h3>
                    </div>

                    <div className="p-6 space-y-5">
                        <PasswordField field="newPassword" label="Mật khẩu mới" placeholder="Tối thiểu 6 ký tự" showKey="new" />
                        <PasswordField field="confirmPassword" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu mới" showKey="confirm" />
                    </div>

                    <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                        <button type="button" onClick={() => navigate('/patient/profile')} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer">
                            <i className="fa-solid fa-xmark mr-2"></i> Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    Xác nhận
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
