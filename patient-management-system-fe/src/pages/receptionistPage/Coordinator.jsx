import React, { useState, useEffect } from 'react';
import { getTodayCheckedInAppointments } from '../../api/appointmentApi';
import { getListActiveRooms } from '../../api/roomApi';
import { assignAppointmentToRoom } from '../../api/appointmentApi';
import { getAllDepartments } from '../../api/departmentsApi';

const Coordinator = () => {
    const [appointments, setAppointments] = useState([]);
    const [activeRooms, setActiveRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [departments, setDepartments] = useState([]);

    // State lưu lịch sử gán (hiển thị ở Khối 2)
    const [assignedHistory, setAssignedHistory] = useState([]);

    // State cho bộ lọc
    const [tempSelectedDept, setTempSelectedDept] = useState("all");
    const [appliedDept, setAppliedDept] = useState("all");

    const handleApplyFilter = () => setAppliedDept(tempSelectedDept);

    const handleResetFilter = () => {
        setTempSelectedDept("all");
        setAppliedDept("all");
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Lấy dữ liệu Phòng
            const responseRooms = await getListActiveRooms();
            const responseRoomsData = responseRooms.data?.data || responseRooms.data || responseRooms || [];
            const currentActiveRooms = Array.isArray(responseRoomsData) ? responseRoomsData : [];
            setActiveRooms(currentActiveRooms);

            // 2. Lấy dữ liệu Lịch hẹn
            const response = await getTodayCheckedInAppointments();
            const responseData = response.data?.data || response?.data || response || [];

            const sortedData = Array.isArray(responseData)
                ? responseData.sort((a, b) => {
                    const timeA = a.DoctorSlots?.start_time || "";
                    const timeB = b.DoctorSlots?.start_time || "";
                    return timeA.localeCompare(timeB);
                })
                : [];

            // 3. TÁCH LÀM 2 BẢNG
            // Bảng trên (Chờ khám): Chỉ lấy những ai 'checked_in'
            const waitingList = sortedData.filter(appt =>
                appt.status?.toLowerCase() === 'checked_in'
            );

            // Bảng dưới (Vừa điều phối): Lấy những ai 'assigned' hoặc 'examining'
            const assignedList = sortedData.filter(appt =>
                ['assigned', 'examing', 'examining'].includes(appt.status?.toLowerCase())
            ).map(appt => {
                // Tìm số phòng tương ứng để hiển thị
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
    }, []);

    // CÁC BIẾN LỌC ĐỂ RENDER
    const filteredAppointments = appointments.filter(appt =>
        appliedDept === "all" || appt.department_id === appliedDept
    );

    const filteredAssignedHistory = assignedHistory.filter(appt =>
        appliedDept === "all" || appt.department_id === appliedDept
    );

    const filteredRooms = activeRooms.filter(room =>
        appliedDept === "all" || room.department_id === appliedDept
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
                if (status === 'readytoexame' || status === 'readytoexam') return 0;
                if (status === 'examing' || status === 'in_use') return 1;
                if (status === 'on' || status === 'empty') return 2;
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
            alert("Vui lòng chọn appointment để gán!");
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

            // 2. Cập nhật trạng thái phòng thành Đang Khám (Examing)
            setActiveRooms(prevRooms =>
                prevRooms.map(room => {
                    return room.room_id === roomId
                        ? {
                            ...room,
                            status: 'examing',       // Cho logic API
                            room_status: 'examing',  // Cho logic Render UI
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
            alert("Gán bệnh nhân vào phòng thành công!");
        } catch (error) {
            console.error("Lỗi khi gán:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi gán!");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            {/* THANH CÔNG CỤ BỘ LỌC */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer w-48"
                            value={tempSelectedDept}
                            onChange={(e) => setTempSelectedDept(e.target.value)}
                        >
                            <option value="all">Tất cả khoa</option>
                            {departments?.map(dept => (
                                <option key={dept.department_id || dept.id} value={dept.department_id || dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-gray-300 hover:text-gray-500 transition-colors px-2">
                        <i className="fa-solid fa-border-all text-xl"></i>
                    </button>
                    <button
                        onClick={handleApplyFilter}
                        className="flex items-center gap-2 bg-[#6B66FF] hover:bg-[#5a55d6] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        <i className="fa-solid fa-filter text-xs"></i>
                        Áp dụng bộ lọc
                    </button>
                    <button
                        onClick={handleResetFilter}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        Đặt lại
                    </button>
                </div>
            </div>

            <div className="flex gap-6">

                {/* ================= CỘT TRÁI ================= */}
                <div className="flex-[8] flex flex-col gap-6">

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
                                                    <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                                        <button className="text-[#4DBE9E] hover:text-teal-700"><i className="fa-solid fa-user-plus"></i></button>
                                                    </div>
                                                </td>
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
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
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
                {/* ================= KẾT THÚC CỘT TRÁI ================= */}

                {/* ================= CỘT PHẢI ================= */}
                <div className="flex-[4] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
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
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <i className="fa-solid fa-user-doctor text-xl"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                    Phòng {room.room_number} <span className="text-gray-400 text-xs font-normal">• {room.doctor?.specialization || "Khoa"}</span>
                                                </p>
                                                <p className="text-base font-bold text-gray-900 mt-0.5">{room.doctor?.Users?.full_name || "Chưa gán bác sĩ"}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{room.doctor?.Users?.email || "N/A"}</p>
                                            </div>
                                        </div>
                                        {normalizeStatus(room.status) === 'readytoexam' || normalizeStatus(room.status) === 'ready to exam' || room.status === 'READY_TO_EXAM' ? (
                                            <span className="bg-[#67D4B6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Sẵn Sàng Khám</span>
                                        ) : room.status?.toLowerCase() === 'examing' || room.status === 'IN_USE' ? (
                                            <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đang Khám</span>
                                        ) : room.room_status === 'on' ? (
                                            <span className="bg-[#C84040] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Trống</span>
                                        ) : room.room_status === 'done' ? (
                                            <span className=" bg-gray-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Hoàn tất</span>
                                        ) : (
                                            <span className="bg-[#67D4B6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Sẵn Sàng Khám</span>
                                        )}
                                    </div>
                                    <div className={`border-t border-[#E5E7EB] pt-3 flex justify-between items-end`}>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Đang gán cho:</p>
                                            {room.assignedAppointment ? (
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {room.assignedAppointment.Patients?.Users?.full_name || "Chưa cập nhật"}
                                                    </p>
                                                    <span className="text-xs text-[#3D9494] font-semibold">
                                                        {room.assignedAppointment.ClinicServices?.Departments?.name || "Đa khoa"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm italic text-gray-400">Chưa gán</span>
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