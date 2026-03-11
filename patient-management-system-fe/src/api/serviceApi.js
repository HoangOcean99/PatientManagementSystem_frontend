import axios from "axios";

export const getServices = async () => await axios.get('/services');
export const getAllServices = async () => await axios.get('/clinic-services/getList');