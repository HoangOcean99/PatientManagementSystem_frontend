import { useState, useEffect } from "react";
import LoadingButton from "./LoadingButton";

const DEFAULT_DATA = {};

const DynamicModal = ({ title, fields, initialData = DEFAULT_DATA, onSubmit, onClose, isLoading = false }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    // Reset form when initialData changes meaningfully
    useEffect(() => {
        setFormData(initialData);
        setErrors({});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach(field => {
            const val = formData[field.name];

            if (field.required && (val === undefined || val === null || val.toString().trim() === "")) {
                newErrors[field.name] = `${field.label} không được để trống`;
            }
            else if (field.type === "number" && val !== undefined && val !== null && isNaN(Number(val))) {
                newErrors[field.name] = `${field.label} phải là một số`;
            }
            else if (field.min !== undefined && val !== undefined && val !== null && Number(val) < field.min) {
                newErrors[field.name] = `${field.label} không được nhỏ hơn ${field.min}`;
            }
            else if (field.validate && typeof field.validate === "function") {
                const customMsg = field.validate(val, formData);
                if (customMsg) {
                    newErrors[field.name] = customMsg;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const baseInputClass =
        "w-full px-3 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    const getInputClass = (fieldName) => {
        const hasError = !!errors[fieldName];
        return `${baseInputClass} ${hasError
            ? "border-red-500 bg-red-50 focus:ring-red-200 text-red-900 placeholder-red-300"
            : "border-gray-300 bg-gray-50 focus:bg-white text-gray-700 placeholder-gray-400"
            }`;
    };

    const renderInput = (field) => {
        const commonProps = {
            className: getInputClass(field.name),
            name: field.name,
            value: formData[field.name] ?? "",
            onChange: handleChange,
            disabled: isLoading,
            placeholder: `Nhập ${field.label.toLowerCase()}...`
        };

        switch (field.type) {
            case "select":
                return (
                    <select {...commonProps}>
                        <option value="">-- Chọn --</option>
                        {field.options?.map(opt => (
                            <option key={opt.value.toString()} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        {...commonProps}
                        className={`${commonProps.className} resize-none`}
                        rows={field.rows || 4}
                    />
                );

            default:
                return (
                    <input
                        {...commonProps}
                        type={field.type}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <style>
                {`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-4px); }
                        75% { transform: translateX(4px); }
                    }
                    .animate-shake {
                        animation: shake 0.4s ease-in-out;
                    }
                `}
            </style>

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-[fadeIn_.3s_ease]"
                onClick={onClose}
            />

            {/* Modal */}
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-[fadeIn_.2s_ease-out] overflow-hidden"
            >

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 italic">
                    <h3 className="text-lg font-bold text-gray-800">
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-200">

                    {fields.map(field => (
                        <div key={field.name} className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                                <span>
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </span>
                            </label>

                            {renderInput(field)}

                            {errors[field.name] && (
                                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1.5 animate-shake">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-gray-300 transition-all active:scale-95"
                    >
                        Hủy
                    </button>


                    <LoadingButton
                        isLoading={isLoading}
                        type="submit"
                        className="px-6 py-2.5 rounded-xl font-bold"
                        loadingText="Đang lưu..."
                    >
                        Lưu thay đổi
                    </LoadingButton>

                </div>
            </form>
        </div>
    );
};

export default DynamicModal;