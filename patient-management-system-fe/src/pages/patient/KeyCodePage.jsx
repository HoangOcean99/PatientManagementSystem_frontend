import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import axiosClient from '../../api/axiosClient';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const KeyCodePage = () => {
    const navigate = useNavigate();
    const [keyCode, setKeyCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputCode, setInputCode] = useState('');
    const [linking, setLinking] = useState(false);

    const generateCode = async () => {
        try {
            setLoading(true);
            const { data: authData } = await supabase.auth.getUser();
            const userId = authData?.user?.id;
            // if (!userId) { navigate('/login'); return; }
            const res = await axiosClient.post('/family-relationships/key-code', { user_id: userId });
            setKeyCode(res.data?.data?.key_code || res.data?.key_code || '');
            toast.success('Đã tạo mã liên kết!');
        } catch (err) {
            console.error('Failed to generate key code:', err);
            toast.error(err.response?.data?.message || 'Không thể tạo mã liên kết');
        } finally {
            setLoading(false);
        }
    };

    const linkWithCode = async () => {
        if (!inputCode.trim()) {
            toast.error('Vui lòng nhập mã liên kết');
            return;
        }
        try {
            setLinking(true);
            const { data: authData } = await supabase.auth.getUser();
            const userId = authData?.user?.id;
            if (!userId) { navigate('/login'); return; }
            await axiosClient.post('/family-relationships/link', { key_code: inputCode.trim(), parent_user_id: userId });
            toast.success('Liên kết thành công!');
            navigate('/patient/under-my-care');
        } catch (err) {
            console.error('Failed to link:', err);
            toast.error(err.response?.data?.message || 'Liên kết thất bại');
        } finally {
            setLinking(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(keyCode);
        toast.success('Đã sao chép mã!');
    };

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/under-my-care')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Liên kết</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Mã liên kết</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* Generate key */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/25">
                                    <i className="fa-solid fa-key"></i>
                                </span>
                                Tạo mã cho con em
                            </h3>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-5">Tạo mã liên kết để người giám hộ khác có thể quản lý hồ sơ của bạn</p>

                            {keyCode ? (
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                                        <span className="text-3xl font-mono font-extrabold text-indigo-700 tracking-[.3em]">{keyCode}</span>
                                    </div>
                                    <div>
                                        <button onClick={copyCode} className="px-5 py-2.5 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer text-sm">
                                            <i className="fa-solid fa-copy mr-2"></i> Sao chép
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={generateCode}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
                                >
                                    {loading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang tạo...</>
                                    ) : (
                                        <><i className="fa-solid fa-wand-magic-sparkles"></i> Tạo mã liên kết</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Link with code */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/25">
                                    <i className="fa-solid fa-link"></i>
                                </span>
                                Liên kết bằng mã
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Nhập mã liên kết từ con em để thêm vào danh sách quản lý</p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    placeholder="Nhập mã liên kết..."
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-mono font-bold tracking-wider placeholder-gray-400 shadow-sm text-center"
                                />
                                <button
                                    onClick={linkWithCode}
                                    disabled={linking}
                                    className="px-6 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 disabled:opacity-60 cursor-pointer flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                                >
                                    {linking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <i className="fa-solid fa-check"></i>}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default KeyCodePage;
