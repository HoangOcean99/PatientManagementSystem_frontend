import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineLock, AiOutlineCalendar, AiOutlineMail, AiOutlineIdcard, AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { HiOutlineArrowNarrowLeft, HiOutlineShieldCheck, HiOutlineUsers } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const RegisterKidPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#f0f7ff] flex items-center justify-center p-4 lg:p-8" style={{ width: '100vw', height: '100vh' }}>
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden flex flex-col md:row md:flex-row" style={{ height: '100%' }}>

                {/* CỘT TRÁI */}
                <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex-col justify-between relative">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <button onClick={() => navigate('/login')} className="mb-10 group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95">
                            <HiOutlineArrowNarrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span>Quay lại đăng nhập</span>
                        </button>
                        <h1 className="text-4xl font-black leading-tight mb-6">Tạo hồ sơ <br /> sức khỏe cho bé</h1>
                        <p className="text-blue-100 leading-relaxed italic text-sm">"Sức khỏe của trẻ em là hạnh phúc của mọi nhà"</p>
                    </div>
                    <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3">
                            <HiOutlineShieldCheck className="text-2xl text-blue-200" />
                            <p className="text-[11px] font-medium leading-relaxed">Chúng tôi cam kết bảo mật thông tin gia đình bạn theo tiêu chuẩn an toàn dữ liệu y tế quốc tế.</p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="w-full md:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-screen md:max-h-[850px] custom-scrollbar">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-800">Đăng ký tài khoản</h2>
                        <p className="text-gray-400 text-sm mt-1">Hoàn thành các bước sau để tạo mã định danh cho bé</p>
                    </div>

                    <div className="space-y-10">
                        {/* BƯỚC 1: TÀI KHOẢN */}
                        <section>
                            <h3 className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">01</span>
                                Thiết lập tài khoản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <div className="relative group">
                                        <AiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input type="text" placeholder="Tên đăng nhập của trẻ" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 ml-2 italic">* Tên dùng để đăng nhập vào hồ sơ riêng của bé</p>
                                </div>
                                <div className="relative group">
                                    <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input type="password" placeholder="Mật khẩu" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all" />
                                </div>
                                <div className="relative group">
                                    <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input type="password" placeholder="Xác nhận mật khẩu" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all" />
                                </div>
                            </div>
                        </section>

                        {/* BƯỚC 2: THÔNG TIN BÉ */}
                        <section>
                            <h3 className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">02</span>
                                Thông tin của trẻ
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative group md:col-span-2">
                                    <AiOutlineIdcard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input type="text" placeholder="Họ và tên đầy đủ của trẻ" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all" />
                                </div>
                                <div className="relative group md:col-span-2">
                                    <AiOutlineCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input type="date" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-gray-500" />
                                </div>
                            </div>
                        </section>

                        {/* BƯỚC 3: NGƯỜI GIÁM HỘ */}
                        <section>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">03</span>
                                    Người giám hộ
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Người giám hộ chính */}
                                <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 space-y-4">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Người giám hộ chính</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <AiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                                            <input type="text" placeholder="Họ tên người giám hộ" className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm" />
                                        </div>
                                        <div className="relative group">
                                            <HiOutlineUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                                            <select className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm text-gray-500 appearance-none">
                                                <option value="">Mối quan hệ</option>
                                                <option value="father">Cha</option>
                                                <option value="mother">Mẹ</option>
                                                <option value="grandparent">Ông/Bà</option>
                                                <option value="other">Người thân khác</option>
                                            </select>
                                        </div>
                                        <div className="relative group md:col-span-2">
                                            <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                                            <input type="email" placeholder="Email nhận mã OTP xác thực" className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm" />
                                        </div>
                                    </div>
                                </div>


                                <label className="flex items-center gap-3 p-5 bg-blue-600 rounded-2xl cursor-pointer group hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                    <input type="checkbox" className="w-5 h-5 rounded border-none text-blue-600 focus:ring-offset-0 transition-all cursor-pointer" />
                                    <span className="text-xs font-bold text-white">Tôi cam đoan là người giám hộ hợp pháp và chịu trách nhiệm về thông tin này.</span>
                                </label>
                            </div>
                        </section>

                        <div className="pt-4">
                            <button className="w-full bg-gray-800 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group">
                                Gửi mã OTP xác nhận
                                <HiOutlineArrowNarrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="z-20 md:hidden mx-auto mt-5">
                            <button
                                onClick={() => navigate('/login')}
                                className=" mx-auto bg-blue-600 text-white group flex items-center gap-2 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                            >
                                <HiOutlineArrowNarrowLeft size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span>Quay lại đăng nhập</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterKidPage;