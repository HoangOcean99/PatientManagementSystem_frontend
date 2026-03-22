import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getAdminById, updateAdmin, getReceptionistById, updateReceptionist, getAccountantById, updateAccountant } from '../../api/userApi';

const ROLE_CONFIG = {
    admin: {
        label: 'Quản trị viên',
        icon: 'fa-user-shield',
        color: '#6366f1',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        idField: 'admin_id',
        apiFn: getAdminById,
        updateFn: updateAdmin,
    },
    receptionist: {
        label: 'Lễ tân',
        icon: 'fa-headset',
        color: '#2563eb',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        idField: 'receptionist_id',
        apiFn: getReceptionistById,
        updateFn: updateReceptionist,
    },
    accountant: {
        label: 'Kế toán',
        icon: 'fa-calculator',
        color: '#059669',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        idField: 'accountant_id',
        apiFn: getAccountantById,
        updateFn: updateAccountant,
    },
};

const StaffDetailsPage = () => {
    const { role, id } = useParams();
    const navigate = useNavigate();

    const roleConfig = ROLE_CONFIG[role];
    if (!roleConfig) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="fa-solid fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <p className="text-lg font-bold text-gray-700">Role không hợp lệ</p>
                </div>
            </div>
        );
    }

    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const apiFunc = await roleConfig.apiFn;
                const res = await apiFunc(id);
                const data = res.data?.data || res.data;
                setStaff(data);
                setFormData({
                    full_name: data?.full_name || '',
                    phone_number: data?.phone_number || '',
                    email: data?.email || '',
                    gender: data?.gender || '',
                    dob: data?.dob || '',
                    avatar_url: data?.avatar_url || '',
                    address: data?.address || '',
                    status: data?.status || 'active',
                });
            } catch (error) {
                console.error('Error fetching staff:', error);
                toast.error(`Không tìm thấy thông tin ${roleConfig.label}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStaff();
        }
    }, [id, role, roleConfig]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updateFunc = roleConfig.updateFn;
            await updateFunc(id, formData);

            setStaff(prev => ({
                ...prev,
                Users: {
                    ...prev.Users,
                    ...formData,
                },
            }));

            setIsEditing(false);
            toast.success(`Cập nhật thông tin ${roleConfig.label} thành công`);
        } catch (error) {
            console.error('Error updating staff:', error);
            toast.error('Cập nhật thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <i className={`fa-solid ${roleConfig.icon} text-4xl`} style={{ color: roleConfig.color, marginBottom: '1rem' }}></i>
                <h3 className="text-xl font-bold text-gray-700">Không tìm thấy {roleConfig.label}</h3>
                <button
                    onClick={() => navigate(`/admin/staffs/${role}`)}
                    className="mt-4 font-bold hover:underline"
                    style={{ color: roleConfig.color }}
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const staffName = staff?.full_name || roleConfig.label;
    const staffAvatar = staff?.avatar_url || 'https://i.pravatar.cc/150?img=11';

    return (
        <div className="min-h-screen pb-12 overflow-y-auto" style={{ width: '100vw', background: `linear-gradient(160deg, ${roleConfig.color}15 0%, ${roleConfig.color}10 50%, #f0f9ff 100%)` }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 top-0 z-30 shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/admin/staffs/${role}`)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div className="flex items-center gap-3">
                                <img src={staffAvatar} alt={staffName} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{staffName}</h1>
                                    <p className="text-sm text-gray-500">{roleConfig.label}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg font-semibold text-white transition-all flex gap-2 items-center"
                                    style={{ background: `linear-gradient(135deg, ${roleConfig.color} 0%, ${roleConfig.color}dd 100%)` }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Chỉnh sửa
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg font-semibold text-white transition-all flex gap-2 items-center disabled:opacity-50"
                                        style={{ background: `linear-gradient(135deg, ${roleConfig.color} 0%, ${roleConfig.color}dd 100%)` }}
                                    >
                                        <i className="fa-solid fa-check"></i>
                                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-user" style={{ color: roleConfig.color }}></i>
                            Thông tin cá nhân
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                        style={{ focusRingColor: roleConfig.color }}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.full_name || '—'}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                    >
                                        <option value="">-- Chọn --</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-700">
                                        {formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : formData.gender === 'other' ? 'Khác' : '—'}
                                    </p>
                                )}
                            </div>

                            {/* DOB */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-gray-700">
                                        {formData.dob ? new Date(formData.dob).toLocaleDateString('vi-VN') : '—'}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.phone_number || '—'}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                        disabled
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.email || '—'}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                                {isEditing ? (
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-700">
                                        {formData.status === 'active' ? (
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                                Không hoạt động
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.address || '—'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetailsPage;
