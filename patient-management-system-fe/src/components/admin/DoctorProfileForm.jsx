import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const DoctorProfileForm = ({ doctor, onSave, isAdmin }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (doctor) {
            reset({
                full_name: doctor.Users?.full_name || '',
                email: doctor.Users?.email || '',
                phone_number: doctor.Users?.phone_number || '',
                avatar_url: doctor.Users?.avatar_url || '',
                specialization: doctor.specialization || '',
                room_number: doctor.room_number || '',
                bio: doctor.bio || '',
                status: doctor.Users?.status || 'active'
            });
        }
    }, [doctor, reset]);

    const onSubmit = async (data) => {
        try {
            await onSave(data);
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật thông tin.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                    <i className="fa-solid fa-user-pen"></i>
                </span>
                Thông tin cá nhân & Chuyên môn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                    <input 
                        {...register('full_name', { 
                            required: "Họ tên không được để trống",
                            minLength: { value: 6, message: "Họ tên phải có ít nhất 6 ký tự" },
                            pattern: {
                                value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ ]+$/,
                                message: "Họ tên không được chứa số hoặc ký tự đặc biệt"
                            }
                        })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.full_name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="Nguyễn Văn A"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium"><i className="fa-solid fa-circle-exclamation mr-1"></i>{errors.full_name.message}</p>}
                </div>

                {/* Email (Readonly) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input 
                        {...register('email')}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                    <input 
                        {...register('phone_number', {
                            required: "Vui lòng nhập số điện thoại",
                            pattern: {
                                value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                                message: "Số điện thoại không đúng định dạng Việt Nam"
                            }
                        })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.phone_number ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chuyên khoa</label>
                    <input 
                        {...register('specialization', { required: "Vui lòng nhập chuyên khoa" })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.specialization ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="Nội tổng hợp, Răng Hàm Mặt..."
                    />
                    {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
                </div>

                {/* Room Number */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phòng khám</label>
                    <input 
                        {...register('room_number', { required: "Vui lòng nhập phòng khám" })}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.room_number ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="Phòng 101"
                    />
                    {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number.message}</p>}
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giới thiệu (Bio)</label>
                    <textarea 
                        {...register('bio')}
                        rows="5"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        placeholder="Kinh nghiệm khám chữa bệnh, bằng cấp..."
                    ></textarea>
                </div>
            </div>

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
