import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import { maskEmail } from "../../helpers/authUtils.js";

const OtpPopUp = ({
    emailParentRef,
    setShowOtpModal,
    handleVerifyAndCreate,
    sendRequestRegister,
    showOtpModal
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [canResend, setCanResend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isLoadingOtp, setIsLoadingOtp] = useState(false);


    useEffect(() => {
        if (!showOtpModal) return;

        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showOtpModal]);

    const otpVerifyAndCreate = async (otp) => {
        setIsLoadingOtp(true);
        await handleVerifyAndCreate(otp);
        setIsLoadingOtp(false);
    }

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value.slice(-1);
        setOtp(newOtp);

        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            e.preventDefault();
            e.target.previousSibling.focus();
        }
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            setShowOtpModal(false);
                            setOtp(['', '', '', '', '', '']);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <AiOutlineClose size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AiOutlineMail size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">Xác thực OTP</h3>
                    <p className="text-gray-500 text-sm mt-2">
                        Mã xác thực đã được gửi đến <br />
                        <span className="font-bold text-blue-600">{maskEmail(emailParentRef.current?.value || emailParentRef)}</span>
                    </p>
                </div>

                <div className="flex gap-2 justify-center mb-8">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            inputMode="numeric"
                            className="w-12 h-14 border-2 border-gray-100 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:bg-blue-50 outline-none transition-all"
                            value={data}
                            onChange={e => handleOtpChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                <button
                    disabled={isLoadingOtp}
                    onClick={() => otpVerifyAndCreate(otp)}
                    className={`w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2
                        ${isLoadingOtp ? "bg-blue-300 cursor-not-allowed text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    {isLoadingOtp ? <LoadingSpinner size='20px' /> :
                        <span>Xác nhận</span>
                    }
                </button>

                <button
                    disabled={!canResend}
                    onClick={() => {
                        if (!canResend) return;
                        sendRequestRegister();
                        setTimeLeft(300);
                        setCanResend(false);
                    }}
                    className={`w-full mt-4 text-sm font-bold transition-colors
                                ${canResend ? "text-blue-600" : "text-gray-400 cursor-not-allowed"}
                            `}
                >
                    {canResend ? "Gửi lại mã" : `Gửi lại mã (${timeLeft}s)`}
                </button>


            </div>
        </div>
    );
}
export default OtpPopUp;