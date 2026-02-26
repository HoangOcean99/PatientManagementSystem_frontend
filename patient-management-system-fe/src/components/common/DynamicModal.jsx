import { useState } from "react";

const DynamicModal = ({ title, fields, initialData = {}, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderInput = (field) => {
        const baseInputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

        switch (field.type) {
            case "select":
                return (
                    <select
                        className={baseInputClass}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn --</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        type={field.type}
                        className={baseInputClass}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="relative w-full max-w-md mx-auto my-6 z-50">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">

                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {title}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    <div className="relative p-6 flex-auto">
                        {fields.map(field => (
                            <div className="mb-4" key={field.name}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {renderInput(field)}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b gap-2">
                        <button
                            className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none hover:text-gray-700 transition-all"
                            type="button"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all"
                            type="button"
                            onClick={() => onSubmit(formData)}
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicModal;