import axiosClient from './axiosClient';

const getListActiveRooms = () => axiosClient.get('/room/getListActive');

const updateRoomStatusByDoctor = (doctorId, status) =>
  axiosClient.patch('/room/update-status-by-doctor', { doctor_id: doctorId, status });

export { getListActiveRooms, updateRoomStatusByDoctor };
