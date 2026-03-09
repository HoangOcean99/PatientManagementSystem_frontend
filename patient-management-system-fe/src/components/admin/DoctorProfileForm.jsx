import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';

// ===== HELPER: Load rooms từ API =====
// Backend cần có endpoint GET /rooms hoặc trả rooms trong doctor detail
const fetchRooms = async () => {
    try {
        const res = await axiosClient.get('/rooms');
        return res.data?.data || res.data || [];
    } catch {
        return [];
    }
};

const fetchDepartments = async () => {
    try {
        const res = await axiosClient.get('/departments');
        return res.data?.data || res.data || [];
    } catch {
        return [];
    }
};

// ===== COMPONENT =====
const DoctorProfileForm = ({ doctor, onSave, isAdmin }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();

    const [rooms, setRooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loadingMeta, setLoadingMeta] = useState(true);

    // ===== Load Rooms & Departments =====
    useEffect(() => {
        const load = async () => {
            setLoadingMeta(true);
            const [r, d] = await Promise.all([fetchRooms(), fetchDepartments()]);
            setRooms(r);
            setDepartments(d);
            setLoadingMeta(false);
        };
        load();
    }, []);

    // ===== Pre-fill form từ doctor object =====
    // Doctor schema: doctor_id, department_id, room_id, specialization, bio
    // Joined:        Users.full_name, Users.email, Users.phone_number, Users.avatar_url, Users.status
    //                Rooms.room_number, Departments.name
    useEffect(() => {
        if (doctor) {
            reset({
                full_name:     doctor.Users?.full_name     || '',
                email:         doctor.Users?.email         || '',
                phone_number:  doctor.Users?.phone_number  || '',
                avatar_url:    doctor.Users?.avatar_url    || '',
                specialization: doctor.specialization      || '',
                department_id:  doctor.department_id       || '',
                room_id:        doctor.room_id             || '',
                bio:            doctor.bio                 || '',
                status:         doctor.Users?.status       || 'active',
            });
        }
    }, [doctor, reset]);

    const onSubmit = async (data) => {
        try {
            await onSave(data);
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi cập nhật thông tin.');
        }
    };

    const avatarUrl = watch('avatar_url');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                    <i className="fa-solid fa-user-pen"></i>
                </span>
                Thông tin cá nhân & Chuyên môn
            </h3>

            {/* Avatar preview */}
            {avatarUrl && (
                <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm bg-gray-100"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <p className="text-sm text-gray-500">Xem trước ảnh đại diện</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('full_name', {
                            required: 'Họ tên không được để trống',
                            minLength: { value: 6, message: 'Họ tên phải có ít nhất 6 ký tự' },
                        })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.full_name ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="Nguyễn Văn A"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errors.full_name.message}</p>}
                </div>

                {/* Email (readonly — lấy từ Users) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                        {...register('email')}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                    />
                    <p className="text-gray-400 text-xs mt-1">Email không thể thay đổi</p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('phone_number', {
                            required: 'Vui lòng nhập số điện thoại',
                            pattern: {
                                value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                                message: 'Số điện thoại không đúng định dạng Việt Nam',
                            },
                        })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.phone_number ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="0912345678"
                    />
                    {errors.phone_number && <p className="text-red-500 text-xs mt-1 font-medium"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errors.phone_number.message}</p>}
                </div>

                {/* Avatar URL */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Avatar URL (Link ảnh)</label>
                    <input
                        {...register('avatar_url')}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="https://..."
                    />
                </div>

                {/* Specialization */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Chuyên khoa <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('specialization', { required: 'Vui lòng nhập chuyên khoa' })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.specialization ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="Nội tổng hợp, Răng Hàm Mặt..."
                    />
                    {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
                </div>

                {/* Department — FK: department_id → Departments */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Khoa <span className="text-red-500">*</span>
                        <span className="text-gray-400 font-normal ml-1 text-xs">(department_id)</span>
                    </label>
                    {loadingMeta ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-sm">
                            Đang tải danh sách khoa...
                        </div>
                    ) : departments.length > 0 ? (
                        <select
                            {...register('department_id', { required: 'Vui lòng chọn khoa' })}
                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.department_id ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer`}
                        >
                            <option value="">-- Chọn khoa --</option>
                            {departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        // Fallback nếu API chưa có endpoint departments
                        <input
                            {...register('department_id')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="UUID của khoa"
                        />
                    )}
                    {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
                </div>

                {/* Room — FK: room_id → Rooms.room_number (thay room_number free text cũ) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phòng khám <span className="text-red-500">*</span>
                        <span className="text-gray-400 font-normal ml-1 text-xs">(room_id)</span>
                    </label>
                    {loadingMeta ? (
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-sm">
                            Đang tải danh sách phòng...
                        </div>
                    ) : rooms.length > 0 ? (
                        <select
                            {...register('room_id', { required: 'Vui lòng chọn phòng khám' })}
                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.room_id ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer`}
                        >
                            <option value="">-- Chọn phòng --</option>
                            {rooms.map((room) => (
                                <option key={room.room_id} value={room.room_id}>
                                    Phòng {room.room_number}
                                    {room.Departments?.name ? ` — ${room.Departments.name}` : ''}
                                </option>
                            ))}
                        </select>
                    ) : (
                        // Fallback nếu API chưa có endpoint rooms
                        <input
                            {...register('room_id')}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="UUID của phòng"
                        />
                    )}
                    {errors.room_id && <p className="text-red-500 text-xs mt-1">{errors.room_id.message}</p>}
                </div>

                {/* Status (Admin only) */}
                {isAdmin && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái hoạt động</label>
                        <select
                            {...register('status')}
                            className="w-full md:w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="active">Hoạt động (Active)</option>
                            <option value="inactive">Tạm ngưng (Inactive)</option>
                        </select>
                    </div>
                )}

                {/* Bio */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giới thiệu (bio)</label>
                    <textarea
                        {...register('bio')}
                        rows="5"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        placeholder="Kinh nghiệm khám chữa bệnh, bằng cấp, thành tích..."
                    ></textarea>
                </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-floppy-disk"></i>
                            Lưu thông tin
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default DoctorProfileForm;
