import axiosClient from "./axiosClient";

export const getListAppointmentsByStatus = async (status) => {
  const url = `/appointment/getListByStatus/${status}`;
  return axiosClient.get(url);
};

export const createAppointment = async (data) => {
  const url = '/appointment/create';
  return axiosClient.post(url, data);
};

export const getListAppointments = async (params) => {
  const url = '/appointment/getList';
  return axiosClient.get(url, { params });
};

export const rescheduleAppointment = async (appointment_id, data) => {
  const url = `/appointment/reschedule/${appointment_id}`;
  return axiosClient.post(url, data);
};

export const cancelAppointment = async (appointment_id) => {
  const url = `/appointment/cancel/${appointment_id}`;
  return axiosClient.patch(url);
};

export const updateAppointmentStatus = async (appointment_id, data) => {
  const url = `/appointment/updateStatus/${appointment_id}`;
  return axiosClient.patch(url, data);
};

export const getTodayCheckedInAppointments = async () => {
  const url = `/appointment/todayCheckedIn`;
  return axiosClient.get(url);
};

export const assignAppointmentToRoom = async (appointment_id, room_id) => {
  const url = `/receptionist/assignAppointmentToRoom/${appointment_id}`;
  return axiosClient.post(url, { room_id });
};


export const getAvailableDoctorSlots = async (department_id) => {
  const url = `/doctor-slots/getAvailableDoctorSlots`;
  return axiosClient.post(url, { department_id: department_id });
};

export const getListAppointmentsByCurrentUserId = async (status, currentUserId) => {
  const url = `/appointment/getListByCurrentUserId/${currentUserId}`;
  return axiosClient.get(url, { params: { status } });
};    