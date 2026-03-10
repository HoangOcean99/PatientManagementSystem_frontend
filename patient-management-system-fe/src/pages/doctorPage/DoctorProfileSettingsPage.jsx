import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiInfo,
  FiPlusCircle,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { getDoctorById, setupDoctor, updateDoctor } from '../../api/doctorApi';
import { getAllDepartments } from '../../api/departmentApi';
import { supabase } from '../../../supabaseClient';
import { validateFullName, validatePhoneNumber } from '../../helpers/validationUtils';
import './DoctorProfileSettingsPage.css';

// ===== HELPERS =====
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const normalizeDepartment = (dep) => ({
  id: dep?.department_id ?? dep?.id ?? '',
  name: dep?.name ?? dep?.department_name ?? '',
});

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
const bannerVariants = {
  hidden: { opacity: 0, y: -16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// ===== COMPONENT =====
const DoctorProfileSettingsPage = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [departments, setDepartments] = useState([]);

  // Mode: 'loading' | 'setup' | 'edit'
  // 'setup'  → bác sĩ chưa có hồ sơ → gọi createDoctor
  // 'edit'   → có hồ sơ → gọi updateDoctor
  const [mode, setMode] = useState('loading');

  // Editable fields
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',     // readonly — lấy từ Users/session
    phone_number: '',
    specialization: '',
    bio: '',     // Doctors.bio
    avatar_url: '',
    department_id: '',     // required khi create
    room_id: '',     // required khi create
  });

  // Readonly — từ FK joins sau khi load
  const [readonlyInfo, setReadonlyInfo] = useState({
    room_number: 'Chưa xếp phòng',
    department_name: 'Chưa xếp khoa',
  });

  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [authResolved, setAuthResolved] = useState(false);
  const [authError, setAuthError] = useState(false); // true khi không có session

  // ===== Fetch departments =====
  useEffect(() => {
    getAllDepartments()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        const arr = Array.isArray(list) ? list : [];
        const normalized = arr.map(normalizeDepartment).filter((dep) => dep.id && dep.name);
        setDepartments(normalized);
      })
      .catch((err) => {
        console.error('[DeptFetch] error:', err);
        setDepartments([]);
      });
  }, []);

  // ===== 1. Lấy user_id từ Supabase session =====
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const uid = data?.session?.user?.id;
        const email = data?.session?.user?.email || '';

        if (uid) {
          setDoctorId(uid);
          setProfile((prev) => ({ ...prev, email }));
        } else {
          const stored = localStorage.getItem('doctor_id') || localStorage.getItem('user_id');
          if (stored) {
            setDoctorId(stored);
          } else {
            // Thᾒ1c sự không có session
            setAuthError(true);
            setMode('setup');
          }
        }
      } catch (error) {
        console.error('[Session] error:', error);
        setAuthError(true);
        setMode('setup');
      } finally {
        setAuthResolved(true);
      }
    };
    getSession();
  }, []);

  // ===== 2. Fetch profile khi có doctorId =====
  useEffect(() => {
    // Chờ auth resolve xong mới quyết định fetch
    if (!authResolved) return;
    // Lỗi auth → không fetch, đã set mode='setup' từ session effect rồi
    if (authError || !doctorId) return;

    const fetchProfile = async () => {
      setMode('loading');
      try {
        const res = await getDoctorById(doctorId, { _t: Date.now() });

        if (res.status === 304 || !res.data) {
          const retry = await getDoctorById(doctorId, { _t: Date.now(), nocache: 1 });
          res.data = retry.data;
        }

        const d = res.data?.data || res.data;

        if (d && d.doctor_id) {
          setProfile((prev) => ({
            full_name: d.Users?.full_name || '',
            email: d.Users?.email || prev.email,
            phone_number: d.Users?.phone_number || '',
            specialization: d.specialization || '',
            bio: d.bio || '',
            avatar_url: d.Users?.avatar_url || '',
            department_id: d.department_id || '',
            room_id: d.room_id || '',
          }));
          setProfileMessage(null);
          setReadonlyInfo({
            room_number: d.Rooms?.room_number || 'Chưa xếp phòng',
            department_name: d.Departments?.name || 'Chưa xếp khoa',
          });
          setMode('edit');
        } else {
          setMode('setup');
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) {
          setMode('setup');
        } else {
          setProfileMessage({ type: 'error', text: 'Không thể kết nối đến server. Vui lòng thử lại.' });
          setMode('setup');
        }
      }
    };

    fetchProfile();
  }, [doctorId, authResolved, authError]); // eslint-disable-line

  // ===== HANDLERS =====
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateFullName(profile.full_name);
    const phoneError = validatePhoneNumber(profile.phone_number, true);
    if (nameError) newErrors.full_name = nameError;
    if (phoneError) newErrors.phone_number = phoneError;

    if (mode === 'setup') {
      if (!profile.specialization.trim()) newErrors.specialization = 'Vui lòng nhập chuyên khoa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!doctorId) {
      setProfileMessage({ type: 'error', text: 'Không tìm thấy ID người dùng.' });
      return;
    }

    try {
      setSaving(true);
      setProfileMessage(null);

      const payload = {
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        specialization: profile.specialization,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        // department_id: bác sĩ tự chọn ở cả setup lẫn edit mode
        ...(profile.department_id && { department_id: profile.department_id }),
        // room_id: chỉ gửi khi create (Admin xếp phòng)
        ...(mode === 'setup' && profile.room_id && { room_id: profile.room_id }),
      };



      if (mode === 'setup') {
        // 🆕 Khởi tạo hồ sơ lần đầu
        await setupDoctor(doctorId, payload);
        setProfileMessage({ type: 'success', text: 'Khởi tạo hồ sơ thành công! Chào mừng bạn đến với hệ thống.' });
        setMode('edit');
      } else {
        // ✏️ Cập nhật thông tin
        await updateDoctor(doctorId, payload);
        setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      }

      setTimeout(() => setProfileMessage(null), 4000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      const msg = error.response?.data?.message || (
        mode === 'setup' ? 'Khởi tạo thất bại. Vui lòng thử lại.' : 'Cập nhật thất bại. Vui lòng thử lại.'
      );
      setProfileMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const isSetup = mode === 'setup';
  const isLoadingMode = mode === 'loading';

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

          {/* ===== FIRST-TIME SETUP BANNER ===== */}
          <AnimatePresence>
            {isSetup && !authError && (
              <motion.div
                variants={bannerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '18px 22px',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1.5px solid #93c5fd',
                  borderRadius: 16,
                  marginBottom: 20,
                  boxShadow: '0 4px 18px rgba(59,130,246,0.10)',
                }}
              >
                <FiPlusCircle size={24} style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.97rem', marginBottom: 4 }}>
                    Chào mừng! Hãy khởi tạo hồ sơ bác sĩ của bạn
                  </p>
                  <p style={{ color: '#3b82f6', fontSize: '0.845rem', lineHeight: 1.55 }}>
                    Đây là lần đầu bạn đăng nhập. Vui lòng điền đầy đủ thông tin phía dưới.
                    Sau khi lưu, Admin sẽ xếp phòng khám và khoa cho bạn.
                  </p>
                </div>
              </motion.div>
            )}
            {authError && (
              <motion.div
                key="auth-error-banner"
                variants={bannerVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '18px 22px',
                  background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                  border: '1.5px solid #fca5a5',
                  borderRadius: 16,
                  marginBottom: 20,
                  boxShadow: '0 4px 18px rgba(239,68,68,0.10)',
                }}
              >
                <FiAlertCircle size={24} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.97rem', marginBottom: 4 }}>
                    Phiên đăng nhập hết hạn
                  </p>
                  <p style={{ color: '#dc2626', fontSize: '0.845rem', lineHeight: 1.55 }}>
                    Không tìm thấy thông tin phiên đăng nhập. Vui lòng đăng xuất và đăng nhập lại.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Profile Card */}
          {isLoadingMode ? (
            <div className="prof-card" style={{ justifyContent: 'center', opacity: 0.6 }}>
              <FiLoader size={24} className="lr-spin" />
            </div>
          ) : (
            <motion.div className="prof-card" variants={itemVariants} initial="hidden" animate="visible">
              <div className="prof-card__avatar">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  getInitials(profile.full_name || profile.email)
                )}
              </div>
              <div className="prof-card__info">
                <h2 className="prof-card__name">
                  {profile.full_name ? `Bs. ${profile.full_name}` : 'Chưa có tên'}
                </h2>
                <p className="prof-card__specialty">
                  {profile.specialization || (isSetup ? 'Chưa cài đặt chuyên khoa' : 'Chuyên khoa chung')}
                </p>
                <p className="prof-card__email">{profile.email}</p>

                {!isSetup && (
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
                )}

                {isSetup && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <FiInfo size={12} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>
                      Hồ sơ chưa được khởi tạo
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== FORM ===== */}
          <motion.div
            className="prof-form-section"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="prof-form-section__header">
              <h3 className="prof-form-section__title">
                {isSetup ? <FiPlusCircle size={16} /> : <FiEdit3 size={16} />}
                {isSetup ? 'Khởi tạo hồ sơ lần đầu' : 'Chỉnh sửa thông tin'}
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
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
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
                  placeholder="Nhập họ và tên đầy đủ"
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
                    placeholder="0912345678"
                  />
                  {errors.phone_number && <span className="prof-field__error">{errors.phone_number}</span>}
                </div>
              </div>

              {/* Specialization */}
              <div className="prof-field">
                <label className="prof-field__label">
                  Chuyên khoa {isSetup && <span>*</span>}
                </label>
                <input
                  type="text"
                  className={`prof-input ${errors.specialization ? 'prof-input--error' : ''}`}
                  value={profile.specialization}
                  onChange={(e) => handleProfileChange('specialization', e.target.value)}
                  placeholder="Nội tổng hợp, Tim mạch, Nhi khoa..."
                />
                {errors.specialization && <span className="prof-field__error">{errors.specialization}</span>}
              </div>

              {/* Room + Department info / IDs */}
              {!isSetup ? (
                /* EDIT mode: readonly display */
                <div className="prof-field-row">
                  <div className="prof-field">
                    <label className="prof-field__label">
                      <FiHome size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      Phòng khám
                      <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 6, fontSize: '0.75rem' }}>
                        (chỉ Admin chỉnh)
                      </span>
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
                    </label>
                    <select
                      className="prof-input prof-select"
                      value={profile.department_id}
                      onChange={(e) => handleProfileChange('department_id', e.target.value)}
                    >
                      <option value="">-- Chọn khoa --</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* SETUP mode: chọn khoa + note về phòng */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Department dropdown */}
                  <div className="prof-field">
                    <label className="prof-field__label">
                      <FiGrid size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      Khoa
                    </label>
                    <select
                      className="prof-input prof-select"
                      value={profile.department_id}
                      onChange={(e) => handleProfileChange('department_id', e.target.value)}
                    >
                      <option value="">-- Chọn khoa --</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Room note */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '12px 16px',
                      background: '#fefce8',
                      border: '1px solid #fde68a',
                      borderRadius: 12,
                    }}
                  >
                    <FiInfo size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: '0.845rem', color: '#92400e', lineHeight: 1.5 }}>
                      <strong>Phòng khám</strong> sẽ được Admin hệ thống xếp sau khi bạn khởi tạo hồ sơ.
                    </p>
                  </div>
                </div>
              )}


              {/* Bio */}
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

              {/* Submit Button */}
              <div className="prof-form-actions">
                <button
                  className={`prof-btn ${isSetup ? 'prof-btn--setup' : 'prof-btn--primary'}`}
                  onClick={handleSave}
                  disabled={saving || isLoadingMode || !doctorId}
                  style={isSetup ? {
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 28px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: '0.97rem',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 18px rgba(37,99,235,0.30)',
                    transition: 'all 0.2s',
                  } : undefined}
                >
                  {saving
                    ? <FiLoader size={16} className="lr-spin" />
                    : isSetup
                      ? <FiPlusCircle size={17} />
                      : <FiSave size={16} />}
                  {saving
                    ? (isSetup ? 'Đang khởi tạo...' : 'Đang lưu...')
                    : isSetup
                      ? 'Khởi tạo hồ sơ'
                      : 'Lưu thay đổi'}
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
