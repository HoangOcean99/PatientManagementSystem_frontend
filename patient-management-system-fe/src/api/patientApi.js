import axiosClient from "./axiosClient";

export const getAllPatients = async () => await axiosClient.get('/patients');
export const searchPatients = async (keyword) => await axiosClient.get('/patient/search', { params: { keyword } });
export const getPatients = async (params) => await axiosClient.get('/patients', { params });
export const getPatientById = async (id) => await axiosClient.get(`/patients/${id}`);
export const createPatient = async (data) => await axiosClient.post('/patients', data);
export const updatePatient = async (userData, avatarFile = null) => {
    const url = "/patients/update";

    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
        }
    });

    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }
    return axiosClient.put(url, formData);
};
export const deletePatient = async (id) => await axiosClient.delete(`/patients/${id}`);
export const getMedicalRecords = async (patientId) => await axiosClient.get(`/patients/${patientId}/medical-records`);
export const getMedicalRecordDetail = async (recordId) => await axiosClient.get(`/patients/medical-records/${recordId}`);
export const generateKeyCode = async (data) => await axiosClient.post('/patients/family-relationships/key-code', data);
export const linkFamilyMember = async (data) => await axiosClient.post('/patients/family-relationships/link', data);
export const createPayment = async (data) => await axiosClient.post('/invoices', data);

// Under My Care - Dependent management
export const getDependents = async () => await axiosClient.get('/under-my-care');
export const addDependent = async (data) => await axiosClient.post('/under-my-care', data);
export const getDependentDetail = async (relationshipId) => await axiosClient.get(`/under-my-care/${relationshipId}`);
export const updateDependent = async (relationshipId, data) => await axiosClient.patch(`/under-my-care/${relationshipId}`, data);
export const removeDependent = async (relationshipId) => await axiosClient.delete(`/under-my-care/${relationshipId}`);
export const generateShareCodeApi = async (childUserId) => await axiosClient.post('/under-my-care/share-code', { child_user_id: childUserId });
export const linkByShareCodeApi = async (shareCode, relationship) => await axiosClient.post('/under-my-care/link', { share_code: shareCode, relationship });
export const inviteByEmailApi = async (email, relationship) => await axiosClient.post('/under-my-care/invite', { email, relationship });
export const acceptEmailInvitationApi = async (invitationCode) => await axiosClient.post('/under-my-care/accept-invite', { invitation_code: invitationCode });

