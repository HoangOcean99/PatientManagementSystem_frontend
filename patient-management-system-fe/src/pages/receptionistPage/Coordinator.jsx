import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getListAppointments, assignAppointmentToRoom } from '../../api/appointmentApi';
import { getListActiveRooms } from '../../api/roomApi';
import { getAllDepartments } from '../../api/departmentsApi';

const getToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const shiftDate = (dateStr, days) => {
    const d = new Date(`${dateStr}T12:00:00`);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const formatDateDisplay = (dateStr) => {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

const Coordinator = () => {
    const [selectedDate, setSelectedDate] = useState(getToday());
    const isViewingToday = selectedDate === getToday();

    const [appointments, setAppointments] = useState([]);
    const [activeRooms, setActiveRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [departments, setDepartments] = useState([]);

    // State lưu lịch sử gán (hiển thị ở Khối 2)
    const [assignedHistory, setAssignedHistory] = useState([]);

    const [departmentFilter, setDepartmentFilter] = useState("all");

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Phòng đang hoạt động (is_active — API getListActive)
            const responseRooms = await getListActiveRooms();
            const responseRoomsData = responseRooms.data?.data || responseRooms.data || responseRooms || [];
            const currentActiveRooms = Array.isArray(responseRoomsData) ? responseRoomsData : [];
            console.log("currentActiveRooms: ", currentActiveRooms);
            setActiveRooms(currentActiveRooms);

            const response = await getListAppointments({ date: selectedDate });
            const responseData = response.data?.data || response?.data || response || [];

            const sortedData = Array.isArray(responseData)
                ? responseData.sort((a, b) => {
                    const timeA = a.DoctorSlots?.start_time || "";
                    const timeB = b.DoctorSlots?.start_time || "";
                    return timeA.localeCompare(timeB);
                })
                : [];

            const waitingList = sortedData.filter(appt =>
                appt.status?.toLowerCase() === 'checked_in'
            );

            const assignedList = sortedData.filter(appt =>
                ['assigned', 'examining', 'examining'].includes(appt.status?.toLowerCase())
            ).map(appt => {
                const room = currentActiveRooms.find(r => r.room_id === appt.room_id);
                return { ...appt, assigned_room: room ? room.room_number : "N/A" };
            });

            // Cập nhật vào 2 state riêng biệt
            setAppointments(waitingList);
            setAssignedHistory(assignedList);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await getAllDepartments();
                setDepartments(data || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách khoa:", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    // Lấy department_id từ appointment (API không flatten field này lên root)
    const getAppointmentDepartmentId = (appt) =>
        appt?.department_id ??
        appt?.ClinicServices?.department_id ??
        appt?.ClinicServices?.Departments?.department_id;

    const matchesDepartmentFilter = (entityDeptId) => {
        if (departmentFilter === "all") return true;
        if (entityDeptId === undefined || entityDeptId === null) return false;
        return String(entityDeptId) === String(departmentFilter);
    };

    // CÁC BIẾN LỌC ĐỂ RENDER
    const filteredAppointments = appointments.filter((appt) =>
        matchesDepartmentFilter(getAppointmentDepartmentId(appt))
    );

    const filteredAssignedHistory = assignedHistory.filter((appt) =>
        matchesDepartmentFilter(getAppointmentDepartmentId(appt))
    );

    const filteredRooms = activeRooms.filter((room) =>
        matchesDepartmentFilter(room.department_id)
    );

    const normalizeStatus = (status) => {
        if (!status) return '';
        return status.toString().trim().toLowerCase();
    };

    const getSortedRooms = (rooms) => {
        return [...rooms].sort((a, b) => {
            const sa = normalizeStatus(a.room_status);
            const sb = normalizeStatus(b.room_status);

            const rank = (s) => {
                const status = s?.toLowerCase().replace(/\s/g, '');
                if (status === 'readytoexame') return 0;
                if (status === 'examining') return 1;
                if (status === 'on') return 2;
                return 3;
            };

            return rank(sa) - rank(sb);
        });
    };

    const handleAppointmentClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId === selectedAppointmentId ? null : appointmentId);
    };

    const handleAssignClick = async (roomId) => {
        if (!selectedAppointmentId) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn cuộc hẹn',
                text: 'Vui lòng chọn một cuộc hẹn từ danh sách trước khi gán phòng!',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        try {
            await assignAppointmentToRoom(selectedAppointmentId, roomId);

            const targetRoom = activeRooms.find(r => r.room_id === roomId);

            // Tìm bệnh nhân đang được chọn (có thể ở bảng trên hoặc bảng dưới)
            let selectedAppt = appointments.find(appt => appt.appointment_id === selectedAppointmentId);
            if (!selectedAppt) {
                selectedAppt = assignedHistory.find(appt => appt.appointment_id === selectedAppointmentId);
            }

            // 1. CHUYỂN BỆNH NHÂN XUỐNG BẢNG "VỪA ĐIỀU PHỐI" (Khối 2)
            setAssignedHistory(prev => {
                const filteredPrev = prev.filter(appt => appt.appointment_id !== selectedAppointmentId);
                return [{
                    ...selectedAppt,
                    status: 'ASSIGNED',
                    assigned_room: targetRoom?.room_number || "N/A"
                }, ...filteredPrev];
            });

            // 2. Cập nhật trạng thái phòng thành Đang Khám (examining)
            setActiveRooms(prevRooms =>
                prevRooms.map(room => {
                    return room.room_id === roomId
                        ? {
                            ...room,
                            status: 'examining',
                            room_status: 'examining',
                            assignedAppointment: selectedAppt
                        }
                        : room;
                })
            );

            // 3. XÓA BỆNH NHÂN KHỎI BẢNG "CHỜ KHÁM" (Khối 1)
            setAppointments(prevAppts =>
                prevAppts.filter(appt => appt.appointment_id !== selectedAppointmentId)
            );

            setSelectedAppointmentId(null);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Gán bệnh nhân vào phòng thành công!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Lỗi khi gán:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || "Có lỗi xảy ra khi gán!",
            });
        }
    };
    useEffect(() => {
        console.log("filteredRooms: ", filteredRooms);
    }, [filteredRooms])

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
            {/* THANH CÔNG CỤ BỘ LỌC */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày làm việc</span>
                        <div className="flex items-center gap-1 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setSelectedDate((prev) => shiftDate(prev, -1))}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                                title="Ngày trước"
                                aria-label="Ngày trước"
                            >
                                <i className="fa-solid fa-chevron-left text-sm"></i>
                            </button>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setSelectedDate((prev) => shiftDate(prev, 1))}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                                title="Ngày sau"
                                aria-label="Ngày sau"
                            >
                                <i className="fa-solid fa-chevron-right text-sm"></i>
                            </button>
                            {!isViewingToday && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedDate(getToday())}
                                    className="text-sm font-semibold text-[#6B66FF] hover:text-[#5a55d6] px-2"
                                >
                                    Hôm nay
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 max-w-[min(100%,280px)]">{formatDateDisplay(selectedDate)}</p>
                    </div>
                    <div className="relative">
                        <label className="sr-only" htmlFor="coordinator-dept-filter">Khoa</label>
                        <select
                            id="coordinator-dept-filter"
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer w-48"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="all">Tất cả khoa</option>
                            {departments?.map(dept => (
                                <option key={dept.department_id || dept.id} value={dept.department_id || dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ================= CỘT TRÁI ================= */}
                <div className="w-full lg:flex-[8] flex flex-col gap-6">

                    {/* KHỐI 1: DANH SÁCH CHỜ */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 flex justify-between items-start border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Danh sách Ứng viên Sẵn sàng</h2>
                                <p className="text-gray-500 text-sm mt-1">Ứng viên đã check-in và đang chờ gán phòng</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Giờ Hẹn</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Ứng viên</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Bác sĩ yêu cầu</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Chuyên khoa</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((appt) => (
                                            <tr
                                                key={appt.appointment_id}
                                                onClick={() => handleAppointmentClick(appt.appointment_id)}
                                                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedAppointmentId === appt.appointment_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(`1970-01-01T${appt.DoctorSlots?.start_time}Z`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={appt.Patients?.Users?.avatar_url || `https://ui-avatars.com/api/?name=${appt.Patients?.Users?.full_name || 'U'}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{appt.Patients?.Users?.full_name || "Chưa cập nhật"}</p>
                                                            <p className="text-xs text-gray-500">{appt.ClinicServices?.name || "Khám bệnh"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                            <i className="fa-solid fa-user-doctor text-xs"></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {appt.Doctors?.Users?.full_name || "Bác sĩ bất kỳ"}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400">ID: {appt.Doctors?.doctor_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-[#E0F4F4] text-[#3D9494] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                                        {appt.ClinicServices?.Departments?.name || "Đa khoa"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block w-28 text-center bg-[#D38B6B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                {/* <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            className="w-10 h-10 rounded-xl bg-purple-50 text-[#7857DB] hover:bg-[#7857DB] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                                                            title="Xem chi tiết"
                                                        >
                                                            <i className="fa-regular fa-eye text-sm"></i>
                                                        </button>
                                                        <button
                                                            className="w-10 h-10 rounded-xl bg-emerald-50 text-[#4DBE9E] hover:bg-[#4DBE9E] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                                                            title="Gán phòng"
                                                        >
                                                            <i className="fa-solid fa-user-plus text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Không có ứng viên nào đang chờ.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* KHỐI 2: VỪA ĐIỀU PHỐI */}
                    {filteredAssignedHistory.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 bg-gray-50/50 flex justify-between items-start border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <i className="fa-solid fa-clock-rotate-left text-blue-500"></i>
                                        Vừa điều phối gần đây
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Các bệnh nhân đã được gán phòng (Có thể click để Reassign)</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-gray-100/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Giờ Hẹn</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Ứng viên</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Bác sĩ yêu cầu</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Chuyên khoa</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Trạng thái</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredAssignedHistory.map((appt) => (
                                            <tr
                                                key={appt.appointment_id}
                                                onClick={() => handleAppointmentClick(appt.appointment_id)}
                                                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedAppointmentId === appt.appointment_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(`1970-01-01T${appt.DoctorSlots?.start_time}Z`).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={appt.Patients?.Users?.avatar_url || `https://ui-avatars.com/api/?name=${appt.Patients?.Users?.full_name || 'U'}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover opacity-80" />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{appt.Patients?.Users?.full_name || "Chưa cập nhật"}</p>
                                                            <p className="text-xs text-gray-500">{appt.ClinicServices?.name || "Khám bệnh"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                            <i className="fa-solid fa-user-doctor text-xs"></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {appt.Doctors?.Users?.full_name || "Bác sĩ bất kỳ"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-[#E0F4F4] text-[#3D9494] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                                        {appt.ClinicServices?.Departments?.name || "Đa khoa"}
                                                    </span>
                                                    <div className="mt-1">
                                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                            Phòng {appt.assigned_room}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block w-28 text-center bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-green-200">
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            className="w-10 h-10 rounded-xl bg-purple-50 text-[#7857DB] hover:bg-[#7857DB] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                                                            title="Xem chi tiết"
                                                        >
                                                            <i className="fa-regular fa-eye text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= CỘT PHẢI ================= */}
                <div className="w-full lg:flex-[4] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-fit lg:sticky lg:top-0">
                    <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Danh sách Bàn trực</h2>
                            <p className="text-gray-500 text-sm mt-1">Theo dõi trạng thái phòng khám</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <i className="fa-solid fa-ellipsis"></i>
                        </button>
                    </div>



                    <div className="p-6 pt-0 space-y-4 overflow-y-auto">
                        {filteredRooms.length > 0 ? (
                            getSortedRooms(filteredRooms).map((room) => (
                                <div key={room.room_id} className="border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                                    <div className="flex justify-between items-start gap-3 mb-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">
                                                <i className="fa-solid fa-user-doctor text-xl"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 truncate">
                                                    Phòng {room.room_number} <span className="text-gray-400 text-xs font-normal">• {room.doctor?.specialization || "Khoa"}</span>
                                                </p>
                                                <p className="text-base font-bold text-gray-900 mt-0.5 truncate">{room.doctor?.Users?.full_name || "Chưa gán bác sĩ"}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 truncate">{room.doctor?.Users?.email || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {console.log("status: ", normalizeStatus(room.room_status))}
                                            {normalizeStatus(room.room_status) == 'readytoexam' ? (
                                                <span className="inline-block w-28 text-center bg-[#67D4B6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Sẵn Sàng Khám</span>
                                            ) : room.room_status?.toLowerCase() == 'examining' ? (
                                                <span className="inline-block w-28 text-center bg-[#D38B6B] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đang Khám</span>
                                            ) : room.room_status == 'on' ? (
                                                <span className="inline-block w-28 text-center bg-[#C84040] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Trống</span>
                                            ) : room.room_status == 'done' ? (
                                                <span className="inline-block w-28 text-center bg-gray-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Hoàn tất</span>
                                            ) : (
                                                <span className="inline-block w-28 text-center bg-[#67D4B6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Sẵn Sàng Khám</span>
                                            )}
                                        </div>
                                        {room.room_status?.toLowerCase().replace(/\s/g, '') === 'readytoexame' &&
                                            !room.assignedAppointment &&
                                            selectedAppointmentId && (
                                                <button
                                                    onClick={() => handleAssignClick(room.room_id)}
                                                    className="bg-[#1c4e11] hover:bg-[#2a751a] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shadow-sm"
                                                >
                                                    Gán ngay
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Chưa có phòng nào đang hoạt động.</p>
                        )}
                    </div>
                </div>
                {/* ================= KẾT THÚC CỘT PHẢI ================= */}

            </div>
        </main>
    );
};

export default Coordinator;