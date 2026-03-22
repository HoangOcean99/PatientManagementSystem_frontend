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

// ===== ROLE-BASED APIS =====
export const getUsersByRole = async (role) => {
    const url = `/users/role/${role}`;
    return axiosClient.get(url);
};

export const getUserByIdAndRole = async (role, id) => {
    const url = `/users/role/${role}/${id}`;
    return axiosClient.get(url);
};

export const updateUserByRole = async (role, id, userData, avatarFile = null) => {
    const url = `/users/role/${role}/${id}`;
    
    if (userData instanceof FormData) {
        if (avatarFile) {
            userData.append("avatar", avatarFile);
        }
        return axiosClient.put(url, userData);
    }

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

// Mappings for backward compatibility
export const getAllAdmins = () => getUsersByRole('admin');
export const getAdminById = (id) => getUserByIdAndRole('admin', id);
export const updateAdmin = (id, data) => updateUserByRole('admin', id, data);

export const getAllReceptionists = () => getUsersByRole('receptionist');
export const getReceptionistById = (id) => getUserByIdAndRole('receptionist', id);
export const updateReceptionist = (id, data) => updateUserByRole('receptionist', id, data);

export const getAllAccountants = () => getUsersByRole('accountant');
export const getAccountantById = (id) => getUserByIdAndRole('accountant', id);
export const updateAccountant = (id, data) => updateUserByRole('accountant', id, data);

// Dedicated role update API
export const updateUserRoleApi = async (id, role) => {
    return axiosClient.put(`/users/${id}/role`, { role });
};
