import axiosClient from "./axiosClient";

export const getAllDepartments = async () => {
  const url = '/departments/getList';
  return axiosClient.get(url);
};
