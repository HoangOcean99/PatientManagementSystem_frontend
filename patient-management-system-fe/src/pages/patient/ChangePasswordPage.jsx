import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { changePassword } from '../../api/authApi';

const ChangePasswordPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.oldPassword) {
            toast.error('Vui lòng nhập mật khẩu cũ');
            return false;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await changePassword(userId, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            toast.success('Đổi mật khẩu thành công!');
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <Toaster position="top-right" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl overflow-hidden p-8 sm:p-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <FiShield className="text-blue-600 text-3xl" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Thiết lập mật khẩu</h1>
                    <p className="text-gray-500 text-sm mt-2">Bảo vệ tài khoản với mật khẩu mạnh hơn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Old Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showOld ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium text-gray-700"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showOld ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiCheckCircle className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium text-gray-700"
                                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showNew ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiCheckCircle className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium text-gray-700"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </span>
                            ) : "Cập nhật mật khẩu"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft /> Quay lại
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePasswordPage;
