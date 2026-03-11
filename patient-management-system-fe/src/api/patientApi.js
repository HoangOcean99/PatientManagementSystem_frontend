import axiosClient from "./axiosClient";

export const getAllPatients = async () => await axiosClient.get('/patients');
export const searchPatients = async (keyword) => await axiosClient.get('/patient/search', { params: { keyword } });
export const getPatients = async (params) => await axiosClient.get('/patients', { params });
export const getPatientById = async (id) => await axiosClient.get(`/patients/${id}`);
export const createPatient = async (data) => await axiosClient.post('/patients', data);
export const updatePatient = async (id, data) => await axiosClient.put(`/patients/${id}`, data);
export const getMedicalRecords = async (patientId) => await axiosClient.get(`/patients/${patientId}/medical-records`);
export const getMedicalRecordDetail = async (recordId) => await axiosClient.get(`/patients/medical-records/${recordId}`);
export const generateKeyCode = async (data) => await axiosClient.post('/patients/family-relationships/key-code', data);
export const linkFamilyMember = async (data) => await axiosClient.post('/patients/family-relationships/link', data);
export const createPayment = async (data) => await axiosClient.post('/invoices', data);
