import axiosClient from "./axiosClient";

export const getAllDoctors = async () => {
    const url = '/doctor/list';
    return axiosClient.get(url);
};

export const searchDoctors = async (name, specialization) => {
    const url = '/doctor/search';
    const params = {};
    if (name) params.name = name;
    if (specialization) params.specialization = specialization;

    return axiosClient.get(url, { params });
};

export const getDoctorById = async (id, params = {}) => {
    const url = `/doctor/detail/${id}`;
    return axiosClient.get(url, { params });
};


export const setupDoctor = async (id, data) => {
    // Tạo hồ sơ bác sĩ lần đầu — doctor_id = user_id từ Supabase auth
    const url = `/doctor/setup/${id}`;
    return axiosClient.post(url, data);
};

export const updateDoctor = async (userData, avatarFile = null) => {
    const url = "/doctor/update";

    const formData = new FormData();
    console.log('temp', userData)

    Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
        }
    });

    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }
    return axiosClient.put(url, formData);
};


export const getAppointmentsByDoctorId = async (id) => {
    const url = `/doctor/appointments/${id}`;
    return axiosClient.get(url);
};
