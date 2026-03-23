import React from "react";

const LoadingButton = ({
    isLoading = false,
    onClick,
    children,
    loadingText = "Đang xử lý...",
    className = "",
    type = "button"
}) => {

    const isDisabled = isLoading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={() => !isDisabled && onClick?.()}
            className={className ? className : `flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition
            ${isDisabled
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                }`}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        opacity="0.25"
                    />
                    <path
                        d="M4 12a8 8 0 018-8"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
            )}

            {isLoading ? loadingText : children}
        </button>
    );
};

export default LoadingButton;