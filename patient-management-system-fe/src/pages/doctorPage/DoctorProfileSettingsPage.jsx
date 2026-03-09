import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiSave,
  FiEdit3,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiLoader,
  FiHome,
  FiGrid,
  FiBookOpen,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { getDoctorById, updateDoctor } from '../../api/doctorApi';
import { supabase } from '../../../supabaseClient';
import { validateFullName, validatePhoneNumber } from '../../helpers/validationUtils';
import './DoctorProfileSettingsPage.css';

// ===== HELPERS =====
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

// ===== ANIMATIONS =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};
const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const DoctorProfileSettingsPage = () => {
  // Lấy doctor_id từ Supabase session (user_id = doctor_id theo schema)
  const [doctorId, setDoctorId] = useState(null);

  // ===== STATE =====
  // Editable fields (theo schema Doctors + Users)
  const [profile, setProfile] = useState({
    full_name:      '',
    email:          '',          // readonly — từ Users
    phone_number:   '',
    specialization: '',
    bio:            '',          // Doctor.bio (thay vì "description")
    avatar_url:     '',
  });

  // Readonly info — hiển thị để bác sĩ biết nhưng không sửa được
  const [readonlyInfo, setReadonlyInfo] = useState({
    room_number:     '',         // Rooms.room_number (qua room_id FK)
    department_name: '',         // Departments.name (qua department_id FK)
    doctor_id:       '',
  });

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // ===== GET DOCTOR ID từ session =====
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data?.session?.user?.id;
      if (uid) {
        setDoctorId(uid);
      } else {
        // Fallback localStorage cho dev
        const stored = localStorage.getItem('doctor_id') || localStorage.getItem('user_id');
        setDoctorId(stored || null);
      }
    };
    getSession();
  }, []);

  // ===== FETCH PROFILE =====
  useEffect(() => {
    if (!doctorId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getDoctorById(doctorId);
        const d   = res.data?.data || res.data;

        if (d) {
          // Editable
          setProfile({
            full_name:      d.Users?.full_name      || '',
            email:          d.Users?.email          || '',
            phone_number:   d.Users?.phone_number   || '',
            specialization: d.specialization        || '',
            bio:            d.bio                   || '',
            avatar_url:     d.Users?.avatar_url     || '',
          });

          // Readonly — phòng và khoa từ FK join
          setReadonlyInfo({
            room_number:     d.Rooms?.room_number   || d.room_number   || 'Chưa xếp phòng',
            department_name: d.Departments?.name    || d.department_name || 'Chưa xếp khoa',
            doctor_id:       d.doctor_id            || doctorId,
          });
        }
      } catch (error) {
        console.error('Failed to fetch doctor profile:', error);
        setProfileMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [doctorId]);

  // ===== HANDLERS =====
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError  = validateFullName(profile.full_name);
    const phoneError = validatePhoneNumber(profile.phone_number);
    if (nameError)  newErrors.full_name    = nameError;
    if (phoneError) newErrors.phone_number = phoneError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateForm()) return;
    if (!doctorId) {
      setProfileMessage({ type: 'error', text: 'Không tìm thấy ID bác sĩ.' });
      return;
    }

    try {
      setSaving(true);
      setProfileMessage(null);

      // Payload theo schema — Doctors: specialization, bio
      //                      Users: full_name, phone_number, avatar_url
      const payload = {
        full_name:      profile.full_name,
        phone_number:   profile.phone_number,
        specialization: profile.specialization,
        bio:            profile.bio,
        avatar_url:     profile.avatar_url,
      };

      await updateDoctor(doctorId, payload);

      setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      const msg = error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      setProfileMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="prof-layout" style={{ width: '100vw' }}>
      <DoctorSidebar activePage="profile" />

      <main className="prof-main">
        <motion.div
          className="prof-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="prof-header" variants={itemVariants}>
            <h1 className="prof-header__title">
              <FiUser size={22} />
              Hồ sơ cá nhân
            </h1>
          </motion.div>

          {/* Profile Card */}
          {loading ? (
            <div className="prof-card" style={{ justifyContent: 'center', opacity: 0.6 }}>
              <FiLoader size={24} className="lr-spin" />
            </div>
          ) : (
            <motion.div className="prof-card" variants={itemVariants} initial="hidden" animate="visible">
              {/* Avatar */}
              <div className="prof-card__avatar">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  getInitials(profile.full_name)
                )}
              </div>

              {/* Info */}
              <div className="prof-card__info">
                <h2 className="prof-card__name">Bs. {profile.full_name || 'Bác sĩ'}</h2>
                <p className="prof-card__specialty">{profile.specialization || 'Chưa cập nhật chuyên khoa'}</p>
                <p className="prof-card__email">{profile.email}</p>

                {/* Readonly room + department */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiHome size={12} />
                    Phòng {readonlyInfo.room_number}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiGrid size={12} />
                    {readonlyInfo.department_name}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Section */}
          <motion.div
            key="profile"
            className="prof-form-section"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="prof-form-section__header">
              <h3 className="prof-form-section__title">
                <FiEdit3 size={16} />
                Chỉnh sửa thông tin
              </h3>
            </div>

            <div className="prof-form-section__body">
              {/* Message */}
              {profileMessage && (
                <div className={`prof-message prof-message--${profileMessage.type}`}>
                  {profileMessage.type === 'success'
                    ? <FiCheckCircle size={16} />
                    : <FiAlertCircle size={16} />}
                  {profileMessage.text}
                </div>
              )}

              {/* Avatar URL */}
              <div className="prof-field">
                <label className="prof-field__label">
                  <FiCamera size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Ảnh đại diện (URL)
                </label>
                <div className="prof-avatar-input">
                  <div className="prof-avatar-input__preview">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar preview"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="prof-avatar-input__placeholder"
                      style={{ display: profile.avatar_url ? 'none' : 'flex' }}
                    >
                      <FiCamera size={20} />
                    </div>
                  </div>
                  <input
                    type="url"
                    className="prof-input"
                    value={profile.avatar_url}
                    onChange={(e) => handleProfileChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="prof-field">
                <label className="prof-field__label">
                  Họ và tên <span>*</span>
                </label>
                <input
                  type="text"
                  className={`prof-input ${errors.full_name ? 'prof-input--error' : ''}`}
                  value={profile.full_name}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  placeholder="Nhập họ và tên"
                />
                {errors.full_name && <span className="prof-field__error">{errors.full_name}</span>}
              </div>

              {/* Email + Phone */}
              <div className="prof-field-row">
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiMail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Email
                  </label>
                  <input
                    type="email"
                    className="prof-input"
                    value={profile.email}
                    disabled
                    placeholder="Email"
                  />
                </div>
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiPhone size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Số điện thoại <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`prof-input ${errors.phone_number ? 'prof-input--error' : ''}`}
                    value={profile.phone_number}
                    onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                    placeholder="Số điện thoại"
                  />
                  {errors.phone_number && <span className="prof-field__error">{errors.phone_number}</span>}
                </div>
              </div>

              {/* Specialization */}
              <div className="prof-field">
                <label className="prof-field__label">Chuyên khoa</label>
                <input
                  type="text"
                  className="prof-input"
                  value={profile.specialization}
                  onChange={(e) => handleProfileChange('specialization', e.target.value)}
                  placeholder="Nội tổng hợp, Tim mạch..."
                />
              </div>

              {/* Readonly: Room + Department — chỉ Admin mới đổi được */}
              <div className="prof-field-row">
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiHome size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Phòng khám
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 4, fontSize: '0.75rem' }}>(chỉ Admin chỉnh)</span>
                  </label>
                  <input
                    type="text"
                    className="prof-input"
                    value={readonlyInfo.room_number}
                    disabled
                  />
                </div>
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiGrid size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Khoa
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 4, fontSize: '0.75rem' }}>(chỉ Admin chỉnh)</span>
                  </label>
                  <input
                    type="text"
                    className="prof-input"
                    value={readonlyInfo.department_name}
                    disabled
                  />
                </div>
              </div>

              {/* Bio (thay description) */}
              <div className="prof-field">
                <label className="prof-field__label">
                  <FiBookOpen size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Giới thiệu bản thân (bio)
                </label>
                <textarea
                  className="prof-textarea"
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Mô tả kinh nghiệm, chuyên môn, bằng cấp..."
                  rows={4}
                />
              </div>

              {/* Submit */}
              <div className="prof-form-actions">
                <button
                  className="prof-btn prof-btn--primary"
                  onClick={handleProfileSave}
                  disabled={saving || loading}
                >
                  {saving ? <FiLoader size={16} className="lr-spin" /> : <FiSave size={16} />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer className="prof-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorProfileSettingsPage;
