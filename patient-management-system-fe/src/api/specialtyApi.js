import axios from "axios";

export const getAllSpecialties = async () => await axios.get('/department/getList');
