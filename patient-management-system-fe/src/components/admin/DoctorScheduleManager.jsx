import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    listDoctorSlots,
    createDoctorSlot,
    updateDoctorSlot,
    deleteDoctorSlot,
} from '../../api/doctorSlotApi';
import LoadingSpinner from '../LoadingSpinner';
import './DoctorScheduleManager.css';

// ===== HELPERS =====
const formatTime = (t) => (t ? t.slice(0, 5) : '');

const formatDateVN = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const getToday = () => new Date().toISOString().split('T')[0];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

// ===== SCROLLABLE 24H TIME PICKER =====
const ScrollTimePicker = ({ value, onChange, label, iconClass, iconColorClass }) => {
    const [hour, minute] = (value || '08:00').split(':');
    const hourRef = useRef(null);
    const minuteRef = useRef(null);

    const scrollToActive = useCallback((ref, idx) => {
        if (!ref.current) return;
        const item = ref.current.children[idx];
        if (item) {
            ref.current.scrollTo({
                top: item.offsetTop - ref.current.offsetTop - (ref.current.clientHeight / 2) + (item.clientHeight / 2),
                behavior: 'smooth',
            });
        }
    }, []);

    useEffect(() => {
        const hIdx = HOURS.indexOf(hour);
        const mIdx = MINUTES.indexOf(minute);
        if (hIdx >= 0) scrollToActive(hourRef, hIdx);
        if (mIdx >= 0) scrollToActive(minuteRef, mIdx);
    }, []);

    const handleHour = (h) => {
        onChange(`${h}:${minute}`);
    };
    const handleMinute = (m) => {
        onChange(`${hour}:${m}`);
    };

    return (
        <div className="dsm-form-group">
            <label className="dsm-form-label">
                <i className={`${iconClass} ${iconColorClass}`} />
                {label}
            </label>
            <div className="dsm-time-picker">
                <div className="dsm-time-picker__col" ref={hourRef}>
                    {HOURS.map((h) => (
                        <button
                            key={h}
                            type="button"
                            className={`dsm-time-picker__item ${h === hour ? 'dsm-time-picker__item--active' : ''}`}
                            onClick={() => handleHour(h)}
                        >
                            {h}
                        </button>
                    ))}
                </div>
                <div className="dsm-time-picker__sep">:</div>
                <div className="dsm-time-picker__col" ref={minuteRef}>
                    {MINUTES.map((m) => (
                        <button
                            key={m}
                            type="button"
                            className={`dsm-time-picker__item ${m === minute ? 'dsm-time-picker__item--active' : ''}`}
                            onClick={() => handleMinute(m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                <div className="dsm-time-picker__preview">
                    {hour}:{minute}
                </div>
            </div>
        </div>
    );
};

// ===== MINI SPINNER =====
const MiniSpinner = () => <div className="dsm-mini-spinner" />;

// ===== MAIN COMPONENT =====
const DoctorScheduleManager = ({ doctorId }) => {
    // ---- Data ----
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // ---- Filters ----
    const [filterDate, setFilterDate] = useState(getToday());
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'available' | 'booked'

    // ---- Sort ----
    const [sortField, setSortField] = useState('start_time'); // 'slot_date' | 'start_time'
    const [sortDir, setSortDir] = useState('asc');

    // ---- Create/Edit modal ----
    const [showModal, setShowModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null); // null → create mode
    const [formData, setFormData] = useState({ slot_date: '', start_time: '08:00', end_time: '09:00' });
    const [saving, setSaving] = useState(false);

    // ---- Delete confirm ----
    const [deleteSlot, setDeleteSlot] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ===== FETCH =====
    const fetchSlots = useCallback(async () => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const params = { doctor_id: doctorId };
            if (filterDate) params.slot_date = filterDate;
            const res = await listDoctorSlots(params);
            const data = res.data?.data || res.data || [];
            setSlots(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            toast.error('Không thể tải danh sách slot');
        } finally {
            setLoading(false);
        }
    }, [doctorId, filterDate]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // ===== FILTERED + SORTED =====
    const displaySlots = useMemo(() => {
        let result = [...slots];

        // Status filter
        if (filterStatus === 'available') result = result.filter((s) => !s.is_booked);
        if (filterStatus === 'booked') result = result.filter((s) => s.is_booked);

        // Sort
        result.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [slots, filterStatus, sortField, sortDir]);

    // ===== STATS =====
    const totalSlots = slots.length;
    const bookedSlots = slots.filter((s) => s.is_booked).length;
    const availableSlots = totalSlots - bookedSlots;

    // ===== SORT HANDLER =====
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return <i className="fa-solid fa-sort dsm-sort-icon dsm-sort-icon--inactive" />;
        }
        return sortDir === 'asc'
            ? <i className="fa-solid fa-sort-up dsm-sort-icon dsm-sort-icon--active" />
            : <i className="fa-solid fa-sort-down dsm-sort-icon dsm-sort-icon--active" />;
    };

    // ===== OPEN CREATE =====
    const openCreateModal = () => {
        setEditingSlot(null);
        setFormData({
            slot_date: filterDate || getToday(),
            start_time: '08:00',
            end_time: '09:00',
        });
        setShowModal(true);
    };

    // ===== OPEN EDIT =====
    const openEditModal = (slot) => {
        setEditingSlot(slot);
        setFormData({
            slot_date: slot.slot_date || '',
            start_time: formatTime(slot.start_time) || '08:00',
            end_time: formatTime(slot.end_time) || '09:00',
        });
        setShowModal(true);
    };

    // ===== SAVE (Create or Update) =====
    const handleSave = async () => {
        // Validation
        if (!formData.slot_date) {
            toast.error('Vui lòng chọn ngày');
            return;
        }
        if (!formData.start_time || !formData.end_time) {
            toast.error('Vui lòng nhập đủ giờ bắt đầu và kết thúc');
            return;
        }
        if (formData.start_time >= formData.end_time) {
            toast.error('Giờ bắt đầu phải trước giờ kết thúc!');
            return;
        }

        try {
            setSaving(true);
            if (editingSlot) {
                await updateDoctorSlot(editingSlot.slot_id, {
                    slot_date: formData.slot_date,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                });
                toast.success('Cập nhật slot thành công!');
            } else {
                await createDoctorSlot({
                    doctor_id: doctorId,
                    slot_date: formData.slot_date,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                });
                toast.success('Tạo slot mới thành công!');
            }
            setShowModal(false);
            setEditingSlot(null);
            fetchSlots();
        } catch (err) {
            const msg = err.response?.data?.message || (editingSlot ? 'Lỗi khi cập nhật slot.' : 'Lỗi khi tạo slot.');
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // ===== DELETE =====
    const handleConfirmDelete = async () => {
        if (!deleteSlot) return;
        try {
            setDeleting(true);
            await deleteDoctorSlot(deleteSlot.slot_id);
            toast.success('Xóa slot thành công!');
            setDeleteSlot(null);
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi xóa slot.');
        } finally {
            setDeleting(false);
        }
    };

    // ===== CLEAR FILTERS =====
    const handleClearFilters = () => {
        setFilterDate('');
        setFilterStatus('all');
    };

    // ===== FORM INPUT HANDLER =====
    const updateForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // ===== RENDER =====
    return (
        <>
            <div className="dsm-wrapper">
                {/* ===== Header ===== */}
                <div className="dsm-header">
                    <h3 className="dsm-header__title">
                        <span className="dsm-header__icon">
                            <i className="fa-solid fa-calendar-alt" />
                        </span>
                        Quản lý lịch làm việc
                    </h3>
                    <button className="dsm-add-btn" onClick={openCreateModal}>
                        <i className="fa-solid fa-plus" />
                        Thêm Slot Mới
                    </button>
                </div>

                {/* ===== Stats Row ===== */}
                <div className="dsm-stats-row">
                    <div className="dsm-stat-card dsm-stat-card--total">
                        <div className="dsm-stat-icon dsm-stat-icon--total">
                            <i className="fa-solid fa-layer-group" />
                        </div>
                        <div>
                            <div className="dsm-stat-value dsm-stat-value--total">{totalSlots}</div>
                            <div className="dsm-stat-label">Tổng slot</div>
                        </div>
                    </div>
                    <div className="dsm-stat-card dsm-stat-card--avail">
                        <div className="dsm-stat-icon dsm-stat-icon--avail">
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <div>
                            <div className="dsm-stat-value dsm-stat-value--avail">{availableSlots}</div>
                            <div className="dsm-stat-label">Còn trống</div>
                        </div>
                    </div>
                    <div className="dsm-stat-card dsm-stat-card--booked">
                        <div className="dsm-stat-icon dsm-stat-icon--booked">
                            <i className="fa-solid fa-clock" />
                        </div>
                        <div>
                            <div className="dsm-stat-value dsm-stat-value--booked">{bookedSlots}</div>
                            <div className="dsm-stat-label">Đã đặt</div>
                        </div>
                    </div>
                </div>

                {/* ===== Toolbar (Filters) ===== */}
                <div className="dsm-toolbar">
                    <div className="dsm-filter-group">
                        <span className="dsm-filter-label">
                            <i className="fa-regular fa-calendar" />
                            Ngày:
                        </span>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="dsm-date-input"
                        />
                    </div>
                    <div className="dsm-filter-group">
                        <span className="dsm-filter-label">
                            <i className="fa-solid fa-filter" />
                            Trạng thái:
                        </span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="dsm-status-select"
                        >
                            <option value="all">Tất cả</option>
                            <option value="available">Còn trống</option>
                            <option value="booked">Đã đặt</option>
                        </select>
                    </div>
                    {(filterDate || filterStatus !== 'all') && (
                        <button className="dsm-clear-btn" onClick={handleClearFilters}>
                            <i className="fa-solid fa-rotate-left" />
                            Xóa bộ lọc
                        </button>
                    )}
                </div>

                {/* ===== Table ===== */}
                <div className="dsm-table-container">
                    {loading ? (
                        <div className="dsm-empty">
                            <LoadingSpinner />
                            <p className="dsm-empty__text dsm-empty__text--loading">Đang tải danh sách slot...</p>
                        </div>
                    ) : displaySlots.length === 0 ? (
                        <div className="dsm-empty">
                            <div className="dsm-empty__icon">
                                <i className="fa-regular fa-calendar-xmark" />
                            </div>
                            <p className="dsm-empty__text">
                                {filterDate ? `Không có slot nào ngày ${formatDateVN(filterDate)}` : 'Chưa có slot khám nào'}
                            </p>
                            <p className="dsm-empty__subtext">Nhấn "Thêm Slot Mới" để tạo ca làm việc</p>
                        </div>
                    ) : (
                        <table className="dsm-table">
                            <thead>
                                <tr>
                                    <th className="dsm-th--num">#</th>
                                    <th
                                        className="dsm-th--sortable"
                                        onClick={() => handleSort('slot_date')}
                                    >
                                        Ngày <SortIcon field="slot_date" />
                                    </th>
                                    <th
                                        className="dsm-th--sortable"
                                        onClick={() => handleSort('start_time')}
                                    >
                                        Giờ bắt đầu <SortIcon field="start_time" />
                                    </th>
                                    <th>Giờ kết thúc</th>
                                    <th>Trạng thái</th>
                                    <th className="dsm-th--center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displaySlots.map((slot, idx) => (
                                    <tr key={slot.slot_id}>
                                        <td className="dsm-td--num">{idx + 1}</td>
                                        <td className="dsm-td--date">{formatDateVN(slot.slot_date)}</td>
                                        <td className="dsm-td--time">{formatTime(slot.start_time)}</td>
                                        <td className="dsm-td--time">{formatTime(slot.end_time)}</td>
                                        <td>
                                            {slot.is_booked ? (
                                                <span className="dsm-badge dsm-badge--booked">
                                                    <span className="dsm-badge__dot dsm-badge__dot--booked" />
                                                    Đã đặt lịch
                                                </span>
                                            ) : (
                                                <span className="dsm-badge dsm-badge--available">
                                                    <span className="dsm-badge__dot dsm-badge__dot--available" />
                                                    Còn trống
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="dsm-actions-cell">
                                                <button
                                                    className={`dsm-action-btn dsm-action-btn--edit ${slot.is_booked ? 'dsm-action-btn--disabled' : ''}`}
                                                    disabled={slot.is_booked}
                                                    title={slot.is_booked ? 'Không thể sửa slot đã đặt lịch' : 'Sửa slot'}
                                                    onClick={() => !slot.is_booked && openEditModal(slot)}
                                                >
                                                    <i className="fa-solid fa-pen" />
                                                </button>
                                                <button
                                                    className={`dsm-action-btn dsm-action-btn--delete ${slot.is_booked ? 'dsm-action-btn--disabled' : ''}`}
                                                    disabled={slot.is_booked}
                                                    title={slot.is_booked ? 'Không thể xóa slot đã đặt lịch' : 'Xóa slot'}
                                                    onClick={() => !slot.is_booked && setDeleteSlot(slot)}
                                                >
                                                    <i className="fa-solid fa-trash-can" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ===== Footer ===== */}
                {!loading && displaySlots.length > 0 && (
                    <div className="dsm-footer">
                        <span>
                            Hiển thị <strong>{displaySlots.length}</strong> / <strong>{slots.length}</strong> slot
                        </span>
                        {filterDate && (
                            <span>
                                <i className="fa-regular fa-calendar" />
                                {formatDateVN(filterDate)}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ===== CREATE / EDIT MODAL ===== */}
            {showModal && (
                <div
                    className="dsm-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditingSlot(null); } }}
                >
                    <div className="dsm-modal">
                        <div className="dsm-modal__header">
                            <h4 className="dsm-modal__title">
                                <i className={editingSlot ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-calendar-plus'} />
                                {editingSlot ? 'Chỉnh sửa Slot' : 'Thêm Slot Mới'}
                            </h4>
                            <button
                                className="dsm-modal__close-btn"
                                onClick={() => { setShowModal(false); setEditingSlot(null); }}
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="dsm-modal__body">
                            <div className="dsm-form-group">
                                <label className="dsm-form-label">
                                    <i className="fa-regular fa-calendar dsm-icon--indigo" />
                                    Ngày (slot_date)
                                </label>
                                <input
                                    type="date"
                                    value={formData.slot_date}
                                    onChange={(e) => updateForm('slot_date', e.target.value)}
                                    className="dsm-form-input"
                                />
                            </div>

                            <div className="dsm-time-row">
                                <ScrollTimePicker
                                    value={formData.start_time}
                                    onChange={(v) => updateForm('start_time', v)}
                                    label="Bắt đầu"
                                    iconClass="fa-regular fa-clock"
                                    iconColorClass="dsm-icon--green"
                                />
                                <ScrollTimePicker
                                    value={formData.end_time}
                                    onChange={(v) => updateForm('end_time', v)}
                                    label="Kết thúc"
                                    iconClass="fa-regular fa-clock"
                                    iconColorClass="dsm-icon--orange"
                                />
                            </div>
                        </div>

                        <div className="dsm-modal__footer">
                            <button
                                className="dsm-btn-cancel"
                                onClick={() => { setShowModal(false); setEditingSlot(null); }}
                            >
                                Hủy
                            </button>
                            <button
                                className="dsm-btn-save"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving && <MiniSpinner />}
                                {saving ? 'Đang lưu...' : editingSlot ? 'Cập nhật' : 'Tạo Slot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== DELETE CONFIRM MODAL ===== */}
            {deleteSlot && (
                <div
                    className="dsm-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget && !deleting) { setDeleteSlot(null); } }}
                >
                    <div className="dsm-modal dsm-modal--delete">
                        <div className="dsm-modal__header">
                            <h4 className="dsm-modal__title dsm-modal__title--danger">
                                <i className="fa-solid fa-triangle-exclamation" />
                                Xác nhận xóa
                            </h4>
                            <button
                                className="dsm-modal__close-btn"
                                onClick={() => !deleting && setDeleteSlot(null)}
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="dsm-modal__body dsm-modal__body--center">
                            <div className="dsm-delete-icon">
                                <i className="fa-solid fa-trash-can" />
                            </div>
                            <p className="dsm-delete-text">
                                Bạn có chắc muốn xóa slot{' '}
                                <strong>{formatTime(deleteSlot.start_time)} – {formatTime(deleteSlot.end_time)}</strong>{' '}
                                ngày{' '}
                                <strong>{formatDateVN(deleteSlot.slot_date)}</strong>?
                                <br />
                                <span className="dsm-delete-text__note">Hành động này không thể hoàn tác.</span>
                            </p>
                        </div>

                        <div className="dsm-modal__footer">
                            <button
                                className="dsm-btn-cancel"
                                onClick={() => !deleting && setDeleteSlot(null)}
                            >
                                Không, giữ lại
                            </button>
                            <button
                                className="dsm-btn-delete-confirm"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting && <MiniSpinner />}
                                {deleting ? 'Đang xóa...' : 'Xóa slot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorScheduleManager;
