import axiosClient from "./axiosClient";

export const getSystemConfig = async () => {
    return axiosClient.get("/system-config/get-config");
};

export const updateSystemConfig = async (data) => {
    return axiosClient.post("/system-config/update-config", data);
};

export const getAllHolidays = async () => {
    return axiosClient.get("/system-config/getAll-holidays");
};

export const createHoliday = async (data) => {
    return axiosClient.post("/system-config/create-holidays", data);
};

export const deleteHoliday = async (id) => {
    return axiosClient.delete(`/system-config/delete-holidays/${id}`);
};

export const checkIsHoliday = async (date) => {
    return axiosClient.get("/system-config/check-is-holiday", {
        params: { date }
    });
};

export const getHolidaysInRange = async (startDate, endDate) => {
    return axiosClient.get("/system-config/getInRange-holidays", {
        params: { startDate, endDate }
    });
};