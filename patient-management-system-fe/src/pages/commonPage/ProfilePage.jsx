import React, { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import toast from 'react-hot-toast';
import { dataURLtoFile } from "../../helpers/imageUtils";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditableField = ({
    label,
    name,
    type = "text",
    value,
    options = [],
    onChange,
    disabled = false
}) => {
    const baseClass = `w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl 
  focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 
  focus:outline-none transition-all font-medium text-gray-700 
  ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                {label}
            </label>

            {type === "textarea" && (
                <textarea
                    name={name}
                    value={value || ""}
                    rows="3"
                    onChange={onChange}
                    disabled={disabled}
                    className={baseClass}
                />
            )}

            {type === "select" && (
                <select
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={disabled}
                    className={baseClass}
                >
                    <option value="">Chọn...</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {type !== "textarea" && type !== "select" && (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={disabled}
                    className={baseClass}
                />
            )}
        </div>
    );
};

const ProfilePage = ({ role = "user", initialData = {}, handleUpdateUser }) => {

    const profileFields = {

        user: [
            { label: "Họ và tên", name: "full_name", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true },
            { label: "Số điện thoại", name: "phone_number", type: "tel" },
            { label: "Ngày sinh", name: "dob", type: "date" },
            {
                label: "Giới tính", name: "gender", type: "select", options: [
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' },
                ]
            },
            { label: "Địa chỉ", name: "address", type: "textarea", colSpan: 2 }
        ],
        patientKid: [
            { label: "Họ và tên", name: "full_name", type: "text" },
            { label: "Tên đăng nhập", name: "username", type: "text", disabled: true },
            { label: "Số điện thoại", name: "phone_number", type: "tel" },
            { label: "Ngày sinh", name: "dob", type: "date" },
            {
                label: "Giới tính", name: "gender", type: "select", options: [
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' },
                ]
            },
            { label: "Địa chỉ", name: "address", type: "textarea", colSpan: 2 },
            { label: "Dị ứng", name: "allergies", type: "textarea", colSpan: 2 },
            { label: "Kết luận lần khám gần nhất", name: "medical_history_summary", type: "textarea", colSpan: 2 },

        ],
        patientAdult: [
            { label: "Họ và tên", name: "full_name", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true },
            { label: "Số điện thoại", name: "phone_number", type: "tel" },
            { label: "Ngày sinh", name: "dob", type: "date" },
            {
                label: "Giới tính", name: "gender", type: "select", options: [
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' },
                ]
            },
            { label: "Địa chỉ", name: "address", type: "textarea", colSpan: 2 },
            { label: "Dị ứng", name: "allergies", type: "textarea", colSpan: 2 },
            { label: "Kết luận lần khám gần nhất", name: "medical_history_summary", type: "textarea", colSpan: 2 },],

        doctor: [
            { label: "Họ và tên", name: "full_name", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true },
            { label: "Số điện thoại", name: "phone_number", type: "tel" },
            { label: "Ngày sinh", name: "dob", type: "date" },
            {
                label: "Giới tính", name: "gender", type: "select", options: [
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' },
                ]
            },
            { label: "Phòng khám", name: "roomName", type: "text", disabled: true },
            { label: "Chuyên ngành", name: "specialization", type: "text" },
            { label: "Chuyên khoa phụ trách", name: "departmentName", type: "text", disabled: true },
            { label: "Địa chỉ", name: "address", type: "textarea", colSpan: 2 },
            { label: "Bio", name: "bio", type: "textarea", colSpan: 2 },

        ]
    };

    const [formData, setFormData] = useState(initialData);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const fileInputRef = useRef(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [showCamera, stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true
            });

            setStream(mediaStream);
            setShowCamera(true);

        } catch (err) {
            console.error("Không mở được camera", err);
        }
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/png");

        setFormData(prev => ({
            ...prev,
            avatar_url: image
        }));
        const file = dataURLtoFile(image, "avatar.png");
        setAvatarFile(file);
        stopCamera();
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        setShowCamera(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showImageOptions && !event.target.closest('.group')) {
                setShowImageOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showImageOptions]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Vui lòng chọn tệp ảnh!");
                return;
            }
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar_url: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSave = async () => {
        try {
            setIsLoading(true);
            await handleUpdateUser(formData, avatarFile);
            toast.success('Cập nhật thông tin thành công')
        } catch (err) {
            toast.success('Cập nhật thông tin thất bại')
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (
            <div className="relative flex-1">
                {isLoading && <LoadingSpinner />}
            </div>
        );
    }

    const fields = profileFields[role] || profileFields.user;

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Hồ sơ cá nhân
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý thông tin tài khoản của bạn
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-blue-700"
                >
                    <Icons.Check size={18} />
                    Lưu thông tin
                </button>
            </div>

            {/* Layout */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">

                    {/* Phần hiển thị Avatar */}
                    <div className="relative group">
                        {/* Avatar Display */}
                        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <Icons.User size={64} className="text-blue-300" />
                            )}
                        </div>

                        {/* Nút Camera chính */}
                        <button
                            onClick={() => setShowImageOptions(!showImageOptions)}
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg border-2 border-white text-white hover:bg-blue-700 transition-all"
                        >
                            <Icons.Camera size={18} />
                        </button>

                        {/* Menu lựa chọn (Chỉ hiện khi nhấn nút Camera) */}
                        {showImageOptions && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10 animate-in fade-in zoom-in duration-200">
                                <button
                                    onClick={() => {
                                        startCamera();
                                        setShowImageOptions(false);
                                    }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    <Icons.Camera size={18} className="text-blue-500" />
                                    Chụp ảnh mới
                                </button>
                                <button
                                    onClick={() => { fileInputRef.current.click(); setShowImageOptions(false); }}
                                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    <Icons.Image size={18} className="text-purple-500" />
                                    Chọn từ thư viện
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <h3 className="mt-5 font-bold text-gray-800 text-xl">
                        {formData.full_name || "User"}
                    </h3>

                    <div className="mt-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">
                        Đang hoạt động
                    </div>
                </div>

                {/* Form */}

                <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        <div className="md:col-span-2 border-b border-gray-50 pb-4 mb-2">
                            <h2 className="text-lg font-bold text-gray-800">
                                Thông tin chi tiết
                            </h2>
                        </div>

                        {fields.map((field) => (
                            <div
                                key={field.name}
                                className={field.colSpan === 2 ? "md:col-span-2" : ""}
                            >
                                <EditableField
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]}
                                    options={field.options}
                                    onChange={handleInputChange}
                                    disabled={field.disabled}
                                />
                            </div>
                        ))}

                    </div>

                </div>
                {showCamera && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4">

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-96 rounded-lg"
                            />

                            <canvas ref={canvasRef} className="hidden" />

                            <div className="flex gap-4">
                                <button
                                    onClick={capturePhoto}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Chụp ảnh
                                </button>

                                <button
                                    onClick={stopCamera}
                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                >
                                    Huỷ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;