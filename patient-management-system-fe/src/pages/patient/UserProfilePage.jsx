import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getPatientById, updatePatient } from '../../api/patientApi';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ProfilePage from '../commonPage/ProfilePage';

const GENDER_MAP = {
    male: { label: 'Nam', icon: 'fa-mars', color: 'text-blue-600', bg: 'bg-blue-50' },
    female: { label: 'Nữ', icon: 'fa-venus', color: 'text-rose-600', bg: 'bg-rose-50' },
    other: { label: 'Khác', icon: 'fa-genderless', color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

const UserProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {
        try {
            const { data: authData } = await supabase.auth.getUser();
            const uid = authData?.user?.id;
            const res = await getPatientById(uid);
            const data = res.data?.data || res.data || null;
            setProfile({
                patient_id: uid,
                user_id: uid,
                allergies: data.allergies,
                medical_history_summary: data.medical_history_summary,
                ...data.Users
            });
        } catch (err) {
            toast.error('Không thể tải thông tin cá nhân');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    const handleUpdateUser = async (formData, avatarFile) => {
        await updatePatient(formData, avatarFile)
    }

    if (loading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            {profile && <ProfilePage
                role="patientAdult"
                initialData={profile}
                handleUpdateUser={handleUpdateUser}
            />}
        </>
    );
};

export default UserProfilePage;
