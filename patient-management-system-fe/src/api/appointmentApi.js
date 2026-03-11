import axiosClient from "./axiosClient";

export const getListAppointmentsByStatus = async (status) => {
  const url = `/appointment/getListByStatus/${status}`;
  return axiosClient.get(url);
};