import axiosClient from './axiosClient';

const getAllDepartments = () => axiosClient.get('/department/getAllDepartments');

export { getAllDepartments };
