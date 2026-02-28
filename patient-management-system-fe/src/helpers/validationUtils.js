export const validateUsername = (username) => {
    if (!username) return "Vui lòng nhập tên đăng nhập";
    const regex = /^[a-zA-Z0-9_]{5,20}$/;
    if (!regex.test(username)) {
        return "Tên đăng nhập từ 5-20 ký tự (chỉ chữ thường, chữ hoa, số và dấu _), không chứa ký tự đặc biệt";
    }
    return null;
};


export const validatePassword = (password) => {
    if (!password) return "Vui lòng nhập mật khẩu";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }
    return null;
};

export const validateFullName = (fullName) => {
    if (!fullName || !fullName.trim()) return "Họ tên không được để trống";
    if (fullName.trim().length < 6) return "Họ tên phải có ít nhất 6 ký tự";
    
    const regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ ]+$/;
    if (!regex.test(fullName)) return "Họ tên không được chứa số hoặc ký tự đặc biệt";
    
    return null;
};

export const validatePhoneNumber = (phoneNumber, isRequired = false) => {
    if (!phoneNumber) {
        return isRequired ? "Vui lòng nhập số điện thoại" : null;
    }
    
    // Phone must match VN operators rules
    const regex = /^(03|05|07|08|09|01[2|6|8|9])[0-9]{8}$/;
    if (!regex.test(phoneNumber)) return "Số điện thoại không đúng định dạng Việt Nam";
    
    return null;
};