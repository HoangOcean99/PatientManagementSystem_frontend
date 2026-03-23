import React, { useEffect, useRef, useState } from 'react';
import * as Icons from "lucide-react";
import toast from 'react-hot-toast';
import { createHoliday, deleteHoliday, getAllHolidays, getSystemConfig, updateSystemConfig } from '../../api/systemConfigApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ScheduleManagement = () => {
    const [systemConfigs, setSystemConfigs] = useState(null);
    const [timeWork, setTimeWork] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHoliday, setIsLoadingHoliday] = useState(false);
    const [holidays, setHolidays] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formDataHoliday, setFormDataHoliday] = useState({ name: '', start_date: '', end_date: '' });

    const timeASlotRef = useRef();
    const percentDepositRef = useRef();

    const dayMap = {
        Monday: "Thứ Hai",
        Tuesday: "Thứ Ba",
        Wednesday: "Thứ Tư",
        Thursday: "Thứ Năm",
        Friday: "Thứ Sáu",
        Saturday: "Thứ Bảy",
        Sunday: "Chủ Nhật"
    };

    useEffect(() => {
        fetchSystemConfigs();
        fetchHolidays();
    }, []);
    const fetchSystemConfigs = async () => {
        try {
            setIsLoading(true);
            const resSystemConfig = await getSystemConfig();
            setSystemConfigs(resSystemConfig.data);
            const objectTimeWork = resSystemConfig.data.filter((i, _) => i.config_key === "timeWork")
            setTimeWork(JSON.parse(objectTimeWork[0].config_value));
        } catch (error) {
            toast.error("Tải dữ liệu không thành công")
        } finally {
            setIsLoading(false);
        }
    }
    const fetchHolidays = async () => {
        try {
            setIsLoadingHoliday(true);
            const resHoliday = await getAllHolidays();
            setHolidays(resHoliday.data);
        } catch (error) {
            toast.error("Tải dữ liệu không thành công")
        } finally {
            setIsLoadingHoliday(false);
        }
    }

    const handleDeleteHoliday = async (id) => {
        try {
            setIsLoadingHoliday(true);
            await deleteHoliday(id);
            fetchHolidays();
        } catch (error) {
            toast.error("Xóa dữ liệu không thành công")
        } finally {
            setIsLoadingHoliday(false);
        }
    }

    const handleCreateHoliday = async () => {
        try {
            setIsLoadingHoliday(true);
            await createHoliday(formDataHoliday);
            fetchHolidays();
        } catch (error) {
            toast.error("Thêm dữ liệu không thành công")
        } finally {
            setIsLoadingHoliday(false);
        }
    }
    const handleUpdateSystemConfigs = async () => {
        try {
            setIsLoading(true);
            await updateSystemConfig([
                { key: 'timeASlot', value: timeASlotRef.current.value },
                { key: 'percentDeposit', value: percentDepositRef.current.value },
                { key: 'timeWork', value: timeWork },
            ]);
            await fetchSystemConfigs();
            toast.success("Cập nhất thiết lập thành công")
        } catch (error) {
            toast.error("Cập nhất thiết lập thất bại")
        } finally {
            setIsLoading(false);
        }
    }

    const handleToggleDay = (index) => {
        setTimeWork(prev =>
            prev.map((day, i) =>
                i === index
                    ? { ...day, is_open: !day.is_open }
                    : day
            )
        );
    };
    const handleTimeChange = (index, session, field, value) => {
        setTimeWork(prev => {
            const updated = [...prev];
            updated[index][session][field] = value;
            return updated;
        });
    };

    if (isLoading) return (
        <div className="relative flex-1">
            <LoadingSpinner />
        </div>
    );

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            <div className="mx-auto flex justify-between items-start mb-10 p-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">CẤU HÌNH VẬN HÀNH</h1>
                    <p className="text-slate-500 font-medium">Thiết lập tham số thời gian và quy tắc hệ thống cho toàn bộ phòng khám.</p>
                </div>
                <div className="flex gap-3">
                    {/* <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                        <Icons.History size={18} /> Xem Audit Logs
                    </button> */}
                    <button
                        onClick={handleUpdateSystemConfigs}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
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
                            {timeWork && timeWork?.map((day, idx) => (
                                <div
                                    key={day.day}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                        <label className="relative inline-flex items-center cursor-pointer scale-90">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={day.is_open}
                                                onChange={() => handleToggleDay(idx)}
                                            />
                                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full 
                                                peer peer-checked:after:translate-x-5 peer-checked:bg-indigo-500 
                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all">
                                            </div>
                                        </label>

                                        <span
                                            className={`text-sm font-bold w-20 ${!day.is_open ? "text-rose-500" : "text-slate-700"
                                                }`}
                                        >
                                            {dayMap[day.day]}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">

                                        {/* Ca sáng */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">
                                                Sáng
                                            </span>

                                            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm group-hover:border-indigo-200">
                                                <input
                                                    type="time"
                                                    onChange={(e) =>
                                                        handleTimeChange(idx, "morning", "start", e.target.value)
                                                    }
                                                    value={day.morning?.start || ""}
                                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1"
                                                />

                                                <span className="text-slate-300">/</span>

                                                <input
                                                    type="time"
                                                    value={day.morning?.end || ""}
                                                    onChange={(e) =>
                                                        handleTimeChange(idx, "morning", "end", e.target.value)
                                                    }
                                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="hidden sm:block h-6 w-[1px] bg-slate-200"></div>

                                        {/* Ca chiều */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">
                                                Chiều
                                            </span>

                                            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm group-hover:border-indigo-200">
                                                <input
                                                    type="time"
                                                    value={day.afternoon?.start || ""}
                                                    onChange={(e) =>
                                                        handleTimeChange(idx, "afternoon", "start", e.target.value)
                                                    }
                                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1"
                                                />

                                                <span className="text-slate-300">/</span>

                                                <input
                                                    type="time"
                                                    value={day.afternoon?.end || ""}
                                                    onChange={(e) =>
                                                        handleTimeChange(idx, "afternoon", "end", e.target.value)
                                                    }
                                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 w-16 px-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: CONFIG THEO KHOA & NGÀY NGHỈ */}
                <div className="col-span-12 lg:col-span-5 space-y-8">
                    <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 overflow-hidden">
                        {/* 1. Lớp phủ Loading nằm TRONG section */}
                        {isLoadingHoliday && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] transition-all">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold text-slate-300 tracking-wider">Đang cập nhật...</span>
                                </div>
                            </div>
                        )}

                        {/* 2. Nội dung bên dưới */}
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            <Icons.CalendarOff className="text-rose-400" size={20} /> Ngày nghỉ & Lễ (Global)
                        </h2>

                        <div className="space-y-3 mb-6">
                            {holidays && holidays.map(holiday => (
                                <div key={holiday.holiday_id} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/5 group hover:bg-white/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{holiday.name}</span>
                                        <span className="text-[10px] text-slate-400">
                                            {holiday.start_date == holiday.end_date ? holiday.start_date : `${holiday.start_date} - ${holiday.end_date}`}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteHoliday(holiday.holiday_id)}
                                        className="text-white/20 group-hover:text-rose-400 transition-colors"
                                    >
                                        <Icons.XCircle size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {isAdding && (
                                <div className="bg-white/5 p-4 rounded-2xl border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-3">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Tên ngày lễ..."
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                            onChange={(e) => setFormDataHoliday({ ...formDataHoliday, name: e.target.value })}
                                        />
                                        <div className='flex gap-3'>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                                onChange={(e) => setFormDataHoliday({ ...formDataHoliday, start_date: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                                onChange={(e) => setFormDataHoliday({ ...formDataHoliday, end_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsAdding(false)}
                                                className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold transition-all"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleCreateHoliday}
                                                className="flex-[2] py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-[10px] font-bold transition-all"
                                            >
                                                Lưu ngày lễ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isAdding && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <Icons.PlusSquare size={16} /> Thêm ngày lễ
                                </button>
                            )}
                        </div>
                    </section>

                    {/* THÔNG TIN TÀI CHÍNH TỔNG QUÁT (INVOICES CONFIG) */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                            <Icons.CreditCard className="text-indigo-500" size={20} /> Chính sách Thanh toán
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase">% Tiền cọc tối thiểu</span>
                                <input
                                    type="number"
                                    ref={percentDepositRef}
                                    defaultValue={systemConfigs ? systemConfigs.filter((i, _) => i.config_key === "percentDeposit").map((i, _) => i.config_value) : null}
                                    className="w-16 bg-slate-50 border-none rounded-lg py-1 px-2 text-xs font-bold text-right text-indigo-600"
                                />
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
                                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500"
                                        type='number'
                                        ref={timeASlotRef}
                                        defaultValue={systemConfigs ? systemConfigs.filter((i, _) => i.config_key === "timeASlot").map((i, _) => i.config_value) : null}
                                    />
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