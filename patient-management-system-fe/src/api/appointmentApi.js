import axiosClient from "./axiosClient";

export const getListAppointmentsByStatus = async (status) => {
  const url = `/appointment/getListByStatus/${status}`;
  return axiosClient.get(url);
};

export const createAppointment = async (data) => {
  const url = '/appointment/create';
  return axiosClient.post(url, data);
};

