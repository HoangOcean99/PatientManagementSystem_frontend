import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { acceptEmailInvitationApi, inviteByEmailApi } from '../../api/patientApi';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const RELATIONSHIP_OPTIONS = [
    { value: 'father', label: 'Cha' },
    { value: 'mother', label: 'Mẹ' },
    { value: 'guardian', label: 'Người giám hộ' },
    { value: 'other', label: 'Khác' },
];

const KeyCodePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('enter'); // 'enter' | 'invite'
    
    // Enter Code State (Accept Invite)
    const [code, setCode] = useState('');
    const [linking, setLinking] = useState(false);
    
    // Generate Code State (Invite By Email)
    const [email, setEmail] = useState('');
    const [relationship, setRelationship] = useState('father');
    const [inviting, setInviting] = useState(false);

    const handleAcceptInvite = async () => {
        if (!code.trim()) {
            toast.error('Vui lòng nhập mã lời mời');
            return;
        }
        try {
            setLinking(true);
            await acceptEmailInvitationApi(code.trim().toUpperCase());
            toast.success('Liên kết người thân thành công!');
            navigate('/patient/under-my-care');
        } catch (err) {
            console.error('Accept invite error:', err);
            toast.error(err.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn');
        } finally {
            setLinking(false);
        }
    };

    const handleSendInvite = async () => {
        if (!email.trim()) {
            toast.error('Vui lòng nhập email');
            return;
        }
        try {
            setInviting(true);
            const res = await inviteByEmailApi(email.trim(), relationship);
            toast.success(res.data?.message || 'Đã gửi lời mời qua email thành công!');
            setEmail('');
        } catch (err) {
            console.error('Send invite error:', err);
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi lời mời');
        } finally {
            setInviting(false);
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans relative" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/under-my-care')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 mb-1">
                                <i className="fa-solid fa-link text-[10px] text-indigo-600"></i>
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Liên kết hồ sơ</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Mã liên kết</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                    
                    <div className="flex border-b border-gray-100">
                        <button 
                            onClick={() => setActiveTab('enter')}
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'enter' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <i className="fa-solid fa-keyboard"></i>
                            Nhận lời mời
                        </button>
                        <button 
                            onClick={() => setActiveTab('invite')}
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'invite' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                            Gửi lời mời
                        </button>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'enter' ? (
                                <motion.div key="enter" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 rounded-2xl border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-indigo-400 text-2xl">
                                            <i className="fa-solid fa-link"></i>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">Nhập mã để liên kết</h2>
                                        <p className="text-gray-500 mt-2 text-sm">Nhập mã gồm 6 ký tự để thêm người phụ thuộc từ một tài khoản khác vào danh sách của bạn.</p>
                                    </div>

                                    <div className="space-y-5 max-w-sm mx-auto">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-600">Mã liên kết</label>
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                placeholder="VD: A3F1B2"
                                                maxLength={6}
                                                className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 bg-white text-lg tracking-[0.2em] font-bold text-center text-gray-800 outline-none focus:border-indigo-400 focus:bg-indigo-50/30 transition-all uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1.5 flex justify-center w-full">
                                            <div className="w-full">
                                                <label className="text-sm font-bold text-gray-600 mb-1.5 block">Mã lời mời (từ email)</label>
                                                <input
                                                    type="text"
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                                    placeholder="VD: A3F1B2"
                                                    maxLength={6}
                                                    className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 bg-white text-lg tracking-[0.2em] font-bold text-center text-gray-800 outline-none focus:border-indigo-400 focus:bg-indigo-50/30 transition-all uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-300"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAcceptInvite}
                                            disabled={linking || code.length < 6}
                                            className="w-full h-12 rounded-xl mt-4 font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
                                        >
                                            {linking ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý...</>
                                            ) : (
                                                <><i className="fa-solid fa-check"></i> Chấp nhận liên kết</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="invite" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 rounded-2xl border-2 border-emerald-100 bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-500 text-2xl">
                                            <i className="fa-solid fa-envelope-open-text"></i>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">Gửi lời mời qua Email</h2>
                                        <p className="text-gray-500 mt-2 text-sm max-w-[280px] mx-auto">Mời một người đã có tài khoản trên hệ thống làm người thân của bạn.</p>
                                    </div>

                                    <div className="space-y-5 max-w-sm mx-auto">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-600 block">Email người nhận</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fa-regular fa-envelope text-gray-400"></i>
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="nguyenvana@gmail.com"
                                                    className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-emerald-400 focus:bg-emerald-50/20 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-600 block">Mối quan hệ đối với bạn</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fa-solid fa-users text-gray-400"></i>
                                                </div>
                                                <select
                                                    value={relationship}
                                                    onChange={(e) => setRelationship(e.target.value)}
                                                    className="w-full h-12 pl-11 pr-10 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-emerald-400 focus:bg-emerald-50/20 transition-all cursor-pointer font-medium appearance-none"
                                                >
                                                    {RELATIONSHIP_OPTIONS.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSendInvite}
                                            disabled={inviting || !email}
                                            className="w-full h-12 rounded-xl mt-6 font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            {inviting ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang gửi email...</>
                                            ) : (
                                                <><i className="fa-solid fa-paper-plane"></i> Gửi lời mời ngay</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default KeyCodePage;
