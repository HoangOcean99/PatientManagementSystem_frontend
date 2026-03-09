import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor, isAdminView = false }) => {
    const navigate = useNavigate();

    if (!doctor) return null;

    // ===== Map đúng theo DB schema =====
    // Doctors JOIN Users (doctor_id = user_id)
    // Doctors JOIN Rooms via room_id → Rooms.room_number
    // Doctors JOIN Departments via department_id → Departments.name
    const userData     = doctor.Users       || {};
    const roomData     = doctor.Rooms       || {};
    const deptData     = doctor.Departments || {};

    const fullName       = userData.full_name    || 'Bác sĩ (Chưa cập nhật tên)';
    const avatarUrl      = userData.avatar_url   || 'https://i.pravatar.cc/150?img=11';
    const specialization = doctor.specialization || 'Chuyên khoa chung';
    const bio            = doctor.bio            || 'Bác sĩ chưa cập nhật thông tin giới thiệu.';
    const roomNumber     = roomData.room_number  || 'Chưa xếp';
    const deptName       = deptData.name         || '';
    const isActive       = userData.status === 'active';
    const id             = doctor.doctor_id;

    const handleCardClick = () => {
        if (!id) return;
        navigate(isAdminView ? `/admin/doctors/${id}` : `/doctors/${id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 border border-gray-100 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-5 items-center relative overflow-hidden"
        >
            {/* Ribbon trạng thái (Admin) */}
            {isAdminView && !isActive && (
                <div className="absolute top-4 right-[-35px] bg-red-500 text-white text-[10px] font-bold px-10 py-1 rotate-45 shadow-sm text-center">
                    TẠM NGƯNG
                </div>
            )}

            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm bg-gray-50 border-2 border-white group-hover:border-blue-100 transition-colors"
                    onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?img=11'; }}
                />
                <div className={`absolute -bottom-2 -right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1.5 ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {isActive ? 'Hoạt động' : 'Tạm ngưng'}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full text-center sm:text-left">
                <div className="mb-1 flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Bs. {fullName}
                    </h3>
                    {isAdminView ? (
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg uppercase">
                            Admin
                        </span>
                    ) : (
                        <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs">
                            <i className="fa-solid fa-star"></i>
                            <span className="font-bold text-gray-700 ml-0.5">5.0</span>
                        </div>
                    )}
                </div>

                {/* Specialty + Department badges */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                        {specialization}
                    </span>
                    {deptName && (
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg">
                            {deptName}
                        </span>
                    )}
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
                    {bio}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-house-medical text-gray-400"></i>
                        <span>Phòng: {roomNumber}</span>
                    </div>
                    {deptName && (
                        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                            <i className="fa-solid fa-building-columns text-gray-400"></i>
                            <span>{deptName}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action */}
            <div className={`mt-4 sm:mt-0 pt-4 sm:pt-0 w-full sm:w-auto sm:border-l ${isAdminView ? 'border-indigo-100' : 'border-gray-100'} sm:pl-6 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 min-w-[130px]`}>
                {!isAdminView ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap"
                    >
                        Đặt lịch
                    </button>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/doctors/${id}`); }}
                        className="w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                    >
                        <i className="fa-solid fa-pen-to-square group-hover/btn:scale-110 transition-transform"></i>
                        Chỉnh sửa
                    </button>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;
