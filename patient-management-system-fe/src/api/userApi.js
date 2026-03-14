import axiosClient from "./axiosClient";

export const getAllUsers = async () => {
    const url = '/users/getAllUsers';
    return axiosClient.get(url);
};

export const getUserById = async (id) => {
    const url = `/users/getUserById/${id}`;
    return axiosClient.get(url);
};
export const updateUser = async (userData, avatarFile = null) => {
    const url = "/users/updateUser";

    const formData = new FormData();

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
