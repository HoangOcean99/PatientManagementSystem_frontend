import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDoctorSchedule, addScheduleSlot, deleteScheduleSlot } from '../../api/scheduleApi';
import LoadingSpinner from '../common/LoadingSpinner';

const DoctorScheduleManager = ({ doctorId }) => {
    // Generate next 7 days mock for UI
    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dates = generateDates();
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add slot state
    const [isAdding, setIsAdding] = useState(false);
    const [newStartTime, setNewStartTime] = useState('08:00');
    const [newEndTime, setNewEndTime] = useState('09:00');

    const formatDateForAPI = (dateStr) => {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
    };

    const fetchSlots = async () => {
        try {
            setLoading(true);
            // Mock fetching or real API: 
            // const res = await getDoctorSchedule(doctorId, formatDateForAPI(selectedDate));
            // For now, we simulate API behavior to allow frontend dev before DB changes
            setTimeout(() => {
                // Mock return
                const dummySlots = [
                    { id: '1', start_time: '08:00', end_time: '09:00', status: 'available' },
                    { id: '2', start_time: '09:30', end_time: '10:30', status: 'available' }
                ];
                setSlots(dummySlots);
                setLoading(false);
            }, 600);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctorId && selectedDate) {
            fetchSlots();
        }
    }, [doctorId, selectedDate]);

    const handleAddSlot = async () => {
        if (newStartTime >= newEndTime) {
            toast.error("Giờ bắt đầu phải trước giờ kết thúc!");
            return;
        }

        try {
            setIsAdding(false);
            // Real API:
            // await addScheduleSlot(doctorId, formatDateForAPI(selectedDate), newStartTime, newEndTime);

            // Mock add:
            const tempId = Math.random().toString(36).substr(2, 9);
            const newSlot = {
                id: tempId,
                start_time: newStartTime,
                end_time: newEndTime,
                status: 'available'
            };
            setSlots([...slots, newSlot].sort((a, b) => a.start_time.localeCompare(b.start_time)));

            toast.success("Thêm Slot thành công!");
            setNewStartTime('08:00');
            setNewEndTime('09:00');
        } catch (error) {
            toast.error("Lỗi khi thêm slot.");
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm("Bạn muốn xoá slot này?")) return;

        try {
            // Real API:
            // await deleteScheduleSlot(doctorId, slotId);

            // Mock delete:
            setSlots(slots.filter(s => s.id !== slotId));
            toast.success("Xoá slot thành công!");
        } catch (error) {
            toast.error("Lỗi khi xoá slot.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
                        <i className="fa-solid fa-calendar-alt"></i>
                    </span>
                    Quản lý lịch làm việc (Slots)
                </h3>
            </div>

            {/* Date Selector (7 Days) */}
            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
                {dates.map((d, idx) => {
                    const isSelected = selectedDate.toDateString() === d.toDateString();
                    const dayName = d.toLocaleDateString('vi-VN', { weekday: 'long' });
                    const dateNum = d.getDate();
                    const monthNum = d.getMonth() + 1;

                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(d)}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-center min-w-[90px] ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            <div className="text-xs opacity-90 mb-1">{idx === 0 ? 'Hôm nay' : dayName}</div>
                            <div className="font-bold text-lg whitespace-nowrap">{dateNum}/{monthNum}</div>
                        </button>
                    );
                })}
            </div>

            {/* Slots Area */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <i className="fa-regular fa-clock text-blue-500"></i>
                        Các ca làm việc ngày {selectedDate.toLocaleDateString('vi-VN')}
                    </h4>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <i className={`fa-solid ${isAdding ? 'fa-times' : 'fa-plus'}`}></i>
                        {isAdding ? 'Hủy' : 'Thêm Slot Mới'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white p-4 rounded-xl border border-blue-100 mb-6 shadow-sm flex items-end gap-4 animate-fade-in">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Từ giờ</label>
                            <input
                                type="time"
                                value={newStartTime}
                                onChange={(e) => setNewStartTime(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Đến giờ</label>
                            <input
                                type="time"
                                value={newEndTime}
                                onChange={(e) => setNewEndTime(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            />
                        </div>
                        <button
                            onClick={handleAddSlot}
                            className="bg-blue-600 text-white px-6 py-2 h-[42px] rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Lưu Slot
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-10 opacity-60">
                        <LoadingSpinner />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <i className="fa-regular fa-calendar-xmark text-4xl mb-3 text-gray-300"></i>
                        <p>Chưa có slot khám nào trong ngày này.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {slots.map((slot) => (
                            <div
                                key={slot.id}
                                className="group bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 flex justify-between items-center transition-all hover:shadow-md"
                            >
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-bold text-lg leading-none mb-1">
                                        {slot.start_time} - {slot.end_time}
                                    </span>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block w-max font-medium">
                                        Còn trống
                                    </span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                                        onClick={() => handleDeleteSlot(slot.id)}
                                        title="Xoá slot"
                                    >
                                        <i className="fa-solid fa-trash-can text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorScheduleManager;
