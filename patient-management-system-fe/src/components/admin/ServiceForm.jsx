import React, { useState } from 'react';
import * as Icons from "lucide-react";

const ServiceForm = ({ initialData, isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header của Modal */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {initialData ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ Mới'}
                        </h2>
                        <p className="text-sm text-gray-500">Cập nhật thông tin chi tiết cho danh mục y tế.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <Icons.X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Tên dịch vụ */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tên dịch vụ</label>
                            <input
                                type="text"
                                defaultValue={initialData?.name}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ví dụ: Khám nội soi dạ dày"
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Mô tả chi tiết</label>
                            <textarea
                                rows="3"
                                defaultValue={initialData?.desc}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Giá tiền */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Chi phí (VNĐ)</label>
                            <div className="relative">
                                <Icons.CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="number" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                            </div>
                        </div>

                        {/* Thời lượng */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Thời lượng (Phút)</label>
                            <div className="relative">
                                <Icons.Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="number" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Trạng thái</label>
                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none">
                                <option value="active">Đang hoạt động</option>
                                <option value="maintenance">Bảo trì</option>
                                <option value="disabled">Ngừng cung cấp</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer của Modal */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onSave}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        {initialData ? 'Cập nhật ngay' : 'Tạo dịch vụ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceForm;