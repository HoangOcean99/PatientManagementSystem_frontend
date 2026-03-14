import React, { useState } from 'react';
import * as Icons from "lucide-react";
import ProfilePage from '../commonPage/ProfilePage';
import { useEffect } from 'react';
import toast, { ToastBar } from 'react-hot-toast';
import { getUserById, updateUser } from '../../api/userApi';
import { supabase } from '../../../supabaseClient';

const AdminProfile = () => {
    const [formData, setFormData] = useState(null);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            const idUser = session.user.id;
            const res = await getUserById(idUser);
            setFormData(res.data.data);
        } catch (error) {
            toast.error("Tải dữ liệu không thành công!")
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

     const handleUpdateUser = async (formData, avatarFile) => {
        await updateUser(formData, avatarFile)
      }

    return (
        <>
            {formData && <ProfilePage
                role="user"
                initialData={formData}
                handleUpdateUser={handleUpdateUser}
            />}
        </>
    );
};

export default AdminProfile;