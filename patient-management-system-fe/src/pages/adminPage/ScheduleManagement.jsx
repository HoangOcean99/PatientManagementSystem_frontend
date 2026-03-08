import React, { useState } from 'react';
import * as Icons from "lucide-react";

const ScheduleManagement = () => {
    // Mock dữ liệu từ bảng Departments
    const [departments] = useState([
        { id: '1000...', name: 'General', status: 'Active' },
        { id: '8d8c...', name: 'Khoa Nội Tổng Quát', status: 'Active' },
        { id: 'd1d1...', name: 'Khoa Nhi', status: 'Active' },
        { id: 'a616...', name: 'Khoa Da Liễu', status: 'Active' },
    ]);

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {/* HEADER: Chứa các hành động quan trọng nhất */}
            <div className="mx-auto flex justify-between items-start mb-10 p-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">CẤU HÌNH VẬN HÀNH</h1>
                    <p className="text-slate-500 font-medium">Thiết lập tham số thời gian và quy tắc hệ thống cho toàn bộ phòng khám.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                        <Icons.History size={18} /> Xem Audit Logs
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        <Icons.Save size={18} /> Áp dụng thay đổi
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 pb-8">

                {/* CỘT TRÁI: THỜI GIAN HOẠT ĐỘNG TOÀN CỤC */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h2 className="font-extrabold text-slate-800 flex items-center gap-2">
                                <Icons.Clock7 className="text-indigo-500" size={20} /> Cấu hình ca làm việc mặc định
                            </h2>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Hệ thống 2 ca</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-3">
                            {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((day, idx) => (
                                <div key={day} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                        <label className="relative inline-flex items-center cursor-pointer scale-90">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={idx < 6} />
                                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                        </label>
                                        <span className={`text-sm font-bold w-20 ${idx > 5 ? 'text-rose-500' : 'text-slate-700'}`}>{day}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        {/* Ca Sáng */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">Sáng</span>
                                            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm group-hover:border-indigo-200">
                                                <input type="time" defaultValue="08:00" className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1" />
                                                <span className="text-slate-300">/</span>
                                                <input type="time" defaultValue="12:00" className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1" />
                                            </div>
                                        </div>

                                        <div className="hidden sm:block h-6 w-[1px] bg-slate-200"></div>

                                        {/* Ca Chiều */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">Chiều</span>
                                            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm group-hover:border-indigo-200">
                                                <input type="time" defaultValue="13:30" className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1" />
                                                <span className="text-slate-300">/</span>
                                                <input type="time" defaultValue="17:30" className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1" />
                                            </div>
                                        </div>

                                        <button title="Sao chép cho các ngày khác" className="p-2 text-slate-300 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Icons.Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: CONFIG THEO KHOA & NGÀY NGHỈ */}
                <div className="col-span-12 lg:col-span-5 space-y-8">

                    {/* CẤU HÌNH NGÀY NGHỈ TOÀN HỆ THỐNG */}
                    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            <Icons.CalendarOff className="text-rose-400" size={20} /> Ngày nghỉ & Lễ (Global)
                        </h2>
                        <div className="space-y-3 mb-6">
                            {[
                                { label: 'Tết Nguyên Đán', date: '25/01 - 02/02' },
                                { label: 'Giải phóng miền Nam', date: '30/04' }
                            ].map(holiday => (
                                <div key={holiday.label} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/5 group hover:bg-white/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{holiday.label}</span>
                                        <span className="text-[10px] text-slate-400">{holiday.date}</span>
                                    </div>
                                    <button className="text-white/20 group-hover:text-rose-400 transition-colors">
                                        <Icons.XCircle size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                            <Icons.PlusSquare size={16} /> Thêm ngày lễ
                        </button>
                    </section>

                    {/* THÔNG TIN TÀI CHÍNH TỔNG QUÁT (INVOICES CONFIG) */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                            <Icons.CreditCard className="text-indigo-500" size={20} /> Chính sách Thanh toán
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase">% Tiền cọc tối thiểu</span>
                                <input type="text" defaultValue="30%" className="w-16 bg-slate-50 border-none rounded-lg py-1 px-2 text-xs font-bold text-right text-indigo-600" />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <h2 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                            <Icons.Settings2 className="text-indigo-500" size={20} /> Quy tắc phân bổ Slot
                        </h2>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thời lượng mỗi Slot (phút)</label>
                                <div className="relative">
                                    <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500">
                                        <option>15 phút</option>
                                        <option selected>30 phút</option>
                                        <option>60 phút</option>
                                    </select>
                                    <Icons.ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                                <p className="text-[10px] text-slate-400 italic">Dựa trên duration_minutes của ClinicServices</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default ScheduleManagement;