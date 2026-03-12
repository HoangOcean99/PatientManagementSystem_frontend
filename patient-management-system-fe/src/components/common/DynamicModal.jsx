import { useState, useEffect } from "react";
import LoadingButton from "./LoadingButton";

const DynamicModal = ({ title, fields, initialData = {}, onSubmit, onClose, isLoading = false }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData?.department_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const baseInputClass =
        "w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

    const renderInput = (field) => {
        switch (field.type) {
            case "select":
                return (
                    <select
                        className={baseInputClass}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <option value="">-- Chọn --</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        className={`${baseInputClass} resize-none`}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        rows={field.rows || 4}
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
                        disabled={isLoading}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        className={baseInputClass}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
                        disabled={isLoading}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-[fadeIn_.2s_ease]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">

                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                                {field.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>

                            {renderInput(field)}
                        </div>
                    ))}

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>


                    <LoadingButton
                        isLoading={isLoading}
                        onClick={() => onSubmit(formData)}
                        loadingText="Đang lưu..."
                    >
                        Lưu thay đổi
                    </LoadingButton>

                </div>
            </div>
        </div>
    );
};

export default DynamicModal;