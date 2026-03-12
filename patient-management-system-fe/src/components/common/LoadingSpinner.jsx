const LoadingSpinner = ({ size = "24px", color = "#3b82f6" }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div
                style={{
                    width: size,
                    height: size,
                    border: "3px solid rgba(0,0,0,0.1)",
                    borderTopColor: color,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }}
            />

            <span className="mt-3 text-sm text-blue-500/70 font-medium">
                Đang tải dữ liệu...
            </span>

            <style>
                {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingSpinner;