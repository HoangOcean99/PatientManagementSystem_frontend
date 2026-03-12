import axiosClient from './axiosClient';

const getListActiveRooms = () => axiosClient.get('/room/getListActive');

export { getListActiveRooms };
