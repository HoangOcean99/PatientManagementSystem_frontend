import React, { useEffect, useState } from 'react';
import * as Icons from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { getClinicServiceById, updateClinicService } from '../../api/clinicServiceApi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DynamicModal from '../../components/common/DynamicModal';
import LoadingButton from '../../components/common/LoadingButton';

const DetailCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-3">{title}</h3>
        <div className="space-y-4 pt-1">
            {children}
        </div>
    </div>
);

const InfoItem = ({ icon: Icon, label, value, isTag = false, colorClass = "text-blue-500" }) => (
    <div className="flex items-start gap-3">
        <div className={`mt-1 ${colorClass}`}>
            <Icon size={18} />
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            {isTag ? (
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${value === 'Đang hoạt động' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {value}
                </span>
            ) : (
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{value}</p>
            )}
        </div>
    </div>
);

const ClinicServiceDetail = () => {
    const navigate = useNavigate();
    const { clinicServiceId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [clinicService, setClinicService] = useState(null);
    const [isShowServiceUpdatePopUp, setIsShowServiceUpdatePopUp] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [initDataEdit, setInitDataEdit] = useState(null);

    const clinicServiceFields = [
        {
            name: "name",
            label: "Tên dịch vụ",
            type: "text",
            required: true
        },
        {
            name: "description",
            label: "Mô tả dịch vụ",
            type: "textarea",
            required: true,
            rows: 5
        },
        {
            name: "price",
            label: "Giá dịch vụ",
            type: "text",
            required: true,
        },
        {
            name: "duration_minutes",
            label: "Thời gian dịch vụ",
            type: "textarea",
            required: true,
        },
        {
            name: "is_active",
            label: "Trạng thái dịch vụ",
            type: "select",
            required: true,
            options: [
                { label: 'Hoạt động', value: true },
                { label: 'Dừng hoạt động', value: false }
            ]
        },

    ];

    useEffect(() => {
        fetchServices();
    }, []);
    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const resService = await getClinicServiceById(clinicServiceId);
            setClinicService(resService.data.data);
        } catch (error) {
            toast.error('Tải dữ liệu thất bại!')
        } finally {
            setIsLoading(false);
        }

    }
    const handleOpenEditPopUp = (data) => {
        try {
            setIsShowServiceUpdatePopUp(true);
            setInitDataEdit(data);
            console.log('data', data);
        } catch (error) {
            toast.error('Không thể mở của sổ chỉnh sửa')
            setIsShowServiceUpdatePopUp(false)
        }
    }
    const handleEditClinicService = async (data) => {
        try {
            const id = data.service_id;
            const mainData = {
                name: data.name,
                description: data.description,
                price: data.price,
                duration_minutes: data.duration_minutes,
                is_active: data.is_active
            }
            setIsLoadingUpdate(true);
            await updateClinicService(id, mainData);
            fetchServices();
            setIsShowServiceUpdatePopUp(false);
            toast.success('Chỉnh sửa dịch vụ thành công');
        } catch (error) {
            toast.error('Chỉnh sửa dịch vụ thất bại');
        } finally {
            setIsLoadingUpdate(false);
        }
    }
    const updateIsActive = async (data) => {
        try {
            const id = data.service_id;
            const mainData = {
                is_active: !data.is_active ? true : false
            }
            setIsLoadingUpdate(true);
            await updateClinicService(id, mainData);
            fetchServices();
            setIsShowServiceUpdatePopUp(false);
            toast.success(`${data.is_active ? 'Tạm ngưng' : 'kích hoạt'} dịch vụ thành công`);
        } catch (error) {
            toast.error(`${data.is_active ? 'Tạm ngưng' : 'kích hoạt'} dịch vụ thất bại`);
        } finally {
            setIsLoadingUpdate(false);
        }
    }
    if (isLoading || !clinicService)
        return (
            <div className="relative flex-1">
                <LoadingSpinner />
            </div>
        );

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            {/* Header điều hướng */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                    <Icons.ArrowLeft size={18} /> Quay lại
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenEditPopUp(clinicService)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                        <Icons.Edit3 size={18} /> Chỉnh sửa
                    </button>
                    <LoadingButton
                        isLoading={isLoadingUpdate}
                        onClick={() => updateIsActive(clinicService)}
                        loadingText={`${clinicService.is_active ? 'Đang tạm ngừng' : 'Đang kích hoạt'}...`}
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold shadow-lg transition-all ${clinicService.is_active ? 'bg-orange-500 shadow-orange-100' : 'bg-green-600 shadow-green-100'}`}
                    >
                        <Icons.Power size={18} /> {clinicService.is_active ? 'Tạm ngừng' : 'Kích hoạt'}
                    </LoadingButton>
                </div>
            </div>

            {/* Bố cục thông tin chi tiết */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột chính: Tên và Mô tả */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <Icons.Stethoscope size={32} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{clinicService.department.name}</span>
                                <h1 className="text-3xl font-bold text-gray-800">{clinicService.name}</h1>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <Icons.AlignLeft size={18} className="text-gray-400" />
                                Mô tả dịch vụ
                            </h4>
                            <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                                {clinicService.description || "Chưa có mô tả cho dịch vụ này."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cột phụ: Các chỉ số (Price, Duration, Status) */}
                <div className="space-y-6">
                    <DetailCard title="Thông số dịch vụ">
                        <InfoItem
                            icon={Icons.Fingerprint}
                            label="Mã dịch vụ (UUID)"
                            value={clinicService.service_id}
                        />
                        <div className="pt-2 border-t border-gray-50">
                            <InfoItem
                                icon={Icons.BadgeDollarSign}
                                label="Giá niêm yết"
                                value={`${new Intl.NumberFormat('vi-VN').format(clinicService.price)} VNĐ`}
                                colorClass="text-green-500"
                            />
                        </div>
                        <div className="pt-2 border-t border-gray-50">
                            <InfoItem
                                icon={Icons.Timer}
                                label="Thời lượng thực hiện"
                                value={`${clinicService.duration_minutes} phút`}
                                colorClass="text-orange-500"
                            />
                        </div>
                        <div className="pt-2 border-t border-gray-50">
                            <InfoItem
                                icon={Icons.Activity}
                                label="Trạng thái"
                                value={clinicService.is_active ? "Đang hoạt động" : "Ngừng kinh doanh"}
                                isTag
                            />
                        </div>
                    </DetailCard>

                    {/* Card nhỏ nhắc nhở quản trị */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                            <Icons.AlertCircle size={24} />
                            <h4 className="font-bold">Lưu ý quản trị</h4>
                        </div>
                        <p className="text-blue-100 text-xs leading-relaxed">
                            Mọi thay đổi về giá hoặc thời lượng sẽ ảnh hưởng trực tiếp đến các lịch hẹn chưa thực hiện. Hãy thông báo cho bác sĩ phụ trách trước khi thay đổi.
                        </p>
                    </div>
                </div>
            </div>
            {isShowServiceUpdatePopUp && <DynamicModal
                title="Chỉnh sửa dịch vụ"
                fields={clinicServiceFields}
                onSubmit={(data) => handleEditClinicService(data)}
                onClose={() => setIsShowServiceUpdatePopUp(false)}
                isLoading={isLoadingUpdate}
                initialData={initDataEdit}

            />}
        </main>
    );
};

export default ClinicServiceDetail;