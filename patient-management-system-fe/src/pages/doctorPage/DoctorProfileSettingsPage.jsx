import React, { useState, useEffect } from 'react';
import { getDoctorById, updateDoctor } from '../../api/doctorApi';
import { validateFullName, validatePhoneNumber } from '../../helpers/validationUtils';
import './DoctorProfileSettingsPage.css';
import ProfilePage from '../commonPage/ProfilePage';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { updateUser } from '../../api/userApi';


const DoctorProfileSettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [idDoctor, setIdDoctor] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const idUser = session.user.id;
      setIdDoctor(idUser);
      const res = await getDoctorById(idUser);
      console.log('res', res)
      const d = res.data?.data || res.data;

      setProfile((prev) => ({
        doctor_id: d.doctor_id || '',
        user_id: d.doctor_id || '',
        full_name: d.Users?.full_name || '',
        email: d.Users?.email || prev.email,
        phone_number: d.Users?.phone_number || '',
        specialization: d.specialization || '',
        bio: d.bio || '',
        avatar_url: d.Users?.avatar_url || '',
        department_id: d.department_id || '',
        departmentName: d.Departments.name || '',
        room_id: d.room_id || '',
        dob: d.Users.dob || '',
        gender: d.Users.gender || '',
        address: d.Users.address || '',
        roomName: d.Rooms.room_number || ''
      }));
    } catch (err) {
      toast.error("Không thể tải dữ liệu")
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateUser = async (formData, avatarFile) => {
    await updateDoctor(formData, avatarFile)
  }
  return (
    <>
      {profile && <ProfilePage
        role="doctor"
        initialData={profile}
        handleUpdateUser={handleUpdateUser}
      />}
    </>
  );
};

export default DoctorProfileSettingsPage;
