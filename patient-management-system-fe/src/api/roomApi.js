import axiosClient from "./axiosClient";

export const getListActiveRooms = async () => {
  const url = '/room/getListActive'; 
  return axiosClient.get(url);
};

