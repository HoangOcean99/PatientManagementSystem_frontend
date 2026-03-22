import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPatientById, createPatient, updatePatientInfo } from '../../api/patientApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const PatientFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [pageLoading, setPageLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        address: '',
        allergies: '',
        lastVisitConclusion: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isEdit) return;
        fetchPatient();
    }, []);
    const fetchPatient = async () => {
        try {
            setPageLoading(true);
            const res = await getPatientById(id);
            const p = res.data?.data || res.data;
            setFormData({
                fullName: p.Users?.full_name || p.fullName || '',
                email: p.Users?.email || p.email || '',
                phoneNumber: p.Users?.phone_number || p.phoneNumber || '',
                dob: p.Users?.dob || p.dob || '',
                gender: p.Users?.gender || p.gender || '',
                address: p.Users?.address || p.address || '',
                allergies: p.allergies || '',
                medical_history_summary: p.medical_history_summary || ''
            });
        } catch (err) {
            console.error('Fetch patient failed:', err);
            toast.error('Không tìm thấy thông tin bệnh nhân');
            navigate('/admin/patients');
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';

        if (!formData.dob) {
            newErrors.dob = 'Vui lòng chọn ngày sinh';
        } else if (new Date(formData.dob) > new Date()) {
            newErrors.dob = 'Ngày sinh không được lớn hơn hiện tại';
        }

        if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại các trường thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await updatePatientInfo({ id, ...formData });
                toast.success('Cập nhật bệnh nhân thành công!');
            } else {
                await createPatient(formData);
                toast.success('Thêm bệnh nhân mới thành công!');
            }
            fetchPatient()
        } catch (err) {
            console.error('Submit failed:', err);
            const msg = err.response?.data?.message || (isEdit ? 'Lỗi khi cập nhật bệnh nhân' : 'Lỗi khi tạo bệnh nhân');
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="relative flex-1 min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    const inputClass = (hasError) =>
        `w-full px-4 py-2.5 bg-white border ${hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`;

    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto" style={{ width: '100%' }}>
            {scrollbarStyles}

            <div className="mx-auto p-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/patients')}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all border border-gray-200"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Chỉnh sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {isEdit ? 'Cập nhật thông tin chi tiết của bệnh nhân' : 'Nhập thông tin bệnh nhân mới vào hệ thống'}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 sm:p-8 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-user-circle text-blue-500"></i>
                            Thông tin Cá nhân
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={inputClass(errors.fullName)}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    className={inputClass(errors.email)}
                                    disabled={true}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="0912345678"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={inputClass(errors.phoneNumber)}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={inputClass(errors.dob)}
                                />
                                {errors.dob && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.dob}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Giới tính <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={inputClass(errors.gender)}
                                >
                                    <option value="">— Chọn giới tính —</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.gender}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Địa chỉ
                                </label>
                                <textarea
                                    name="address"
                                    rows="2"
                                    placeholder="Nhập địa chỉ cư trú..."
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`${inputClass(errors.address)} resize-none`}
                                ></textarea>
                            </div>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-notes-medical text-blue-500"></i>
                            Thông tin Y tế
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className={labelClass}>
                                    Dị ứng (nếu có)
                                </label>
                                <textarea
                                    name="allergies"
                                    rows="2"
                                    placeholder="Thuốc, thực phẩm, hoặc các tác nhân khác..."
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className={`${inputClass(errors.allergies)} resize-none`}
                                ></textarea>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Kết luận lần khám gần nhất
                                </label>
                                <textarea
                                    name="medical_history_summary"
                                    rows="3"
                                    placeholder="Ghi chú về tình trạng sức khỏe từ lần khám trước..."
                                    value={formData.medical_history_summary}
                                    onChange={handleChange}
                                    className={`${inputClass(errors.medical_history_summary)} resize-none`}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex items-center gap-3 justify-end rounded-b-2xl">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/patients')}
                            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientFormPage;
