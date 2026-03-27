import React, { useState, useEffect } from 'react';
import ProfilePage from '../commonPage/ProfilePage';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getUserById, updateUser } from '../../api/userApi';


const LabProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const idUser = session.user.id;
      setUserId(idUser);
      const res = await getUserById(idUser);
      const d = res.data?.data || res.data;

      setProfile({
        user_id: d.user_id || idUser,
        full_name: d.full_name || '',
        email: d.email || '',
        phone_number: d.phone_number || '',
        avatar_url: d.avatar_url || '',
        dob: d.dob || '',
        gender: d.gender || '',
        address: d.address || '',
      });
    } catch (err) {
      toast.error("Không thể tải dữ liệu")
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateUser = async (formData, avatarFile) => {
    await updateUser(formData, avatarFile)
  }
  return (
    <>
      {profile && <ProfilePage
        role="user"
        initialData={profile}
        handleUpdateUser={handleUpdateUser}
      />}
    </>
  );
};

export default LabProfilePage;

