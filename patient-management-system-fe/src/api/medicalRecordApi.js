import axiosClient from "./axiosClient";

export const medicalRecordApi = {
    // Action APIs
    startExamination: async (data) => {
        return await axiosClient.post('/medical-record/start', data);
    },
    completeExamination: async (data) => {
        return await axiosClient.post('/medical-record/complete', data);
    },

    // Querying APIs
    getMedicalRecordById: async (recordId) => {
        return await axiosClient.get(`/medical-record/detail/${recordId}`);
    },
    getMedicalRecordByAppointmentId: async (appointmentId) => {
        return await axiosClient.get(`/medical-record/appointment/${appointmentId}`);
    },
    getMedicalRecordsByPatientId: async (patientId) => {
        return await axiosClient.get(`/medical-record/patient/${patientId}`);
    },

    // Update API
    updateMedicalRecord: async (recordId, data) => {
        return await axiosClient.patch(`/medical-record/update/${recordId}`, data);
    },
};

export default medicalRecordApi;