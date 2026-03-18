import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiCheck,
  FiX,
  FiLoader,
  FiExternalLink,
  FiUser,
  FiPhone,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import AccountantSidebar from '../../components/accountant/AccountantSidebar';
import {
  getPendingDeposits,
  confirmDeposit,
  searchApptsForDeposit
} from '../../api/accountantApi';
import { toast, Toaster } from 'react-hot-toast';
import './DepositManagementPage.css';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN').format(amount) + ' đ';

const STATUS_MAP = {
  pending: { label: 'Chưa cọc', cls: 'unpaid' },
  confirmed: { label: 'Đã cọc', cls: 'paid' },
  refunded: { label: 'Hoàn trả', cls: 'refunded' },
};

const ITEMS_PER_PAGE = 10;

const DepositManagementPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchApptQuery, setSearchApptQuery] = useState('');
  const [apptResults, setApptResults] = useState([]);
  const [isSearchingAppt, setIsSearchingAppt] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => { fetchDeposits(); }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await getPendingDeposits();
      const mapped = (res.data || []).map((d, idx) => ({
        id: d.appointment_id,
        code: `DP${String(idx + 1).padStart(3, '0')}`,
        patient_name: d.Patients?.Users?.full_name || 'N/A',
        phone: d.Patients?.Users?.phone_number || '',
        service: d.ClinicServices?.name || 'Khám tổng quát',
        amount: d.deposit_required - (d.deposit_paid || 0),
        date: new Date(d.created_at).toISOString().split('T')[0],
        status: (d.deposit_paid || 0) >= d.deposit_required ? 'confirmed' : 'pending',
      }));
      setDeposits(mapped);
    } catch {
      toast.error('Lỗi khi tải danh sách!');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeposits = useMemo(() => {
    return deposits.filter((dep) => {
      const q = searchTerm.toLowerCase();
      const matchSearch = dep.patient_name.toLowerCase().includes(q) ||
                          dep.code.toLowerCase().includes(q) ||
                          dep.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || dep.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deposits, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDeposits.length / ITEMS_PER_PAGE));
  const paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Appointment search for modal
  useEffect(() => {
    if (!showAddModal) return;
    
    const t = setTimeout(() => {
      searchAppts(searchApptQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchApptQuery, showAddModal]);

  const searchAppts = async (q = '') => {
    try {
      setIsSearchingAppt(true);
      const res = await searchApptsForDeposit(q);
      setApptResults(res.data || []);
    } catch { /* silent */ } finally {
      setIsSearchingAppt(false);
    }
  };

  const handleSelectAppt = (appt) => {
    setSelectedAppt(appt);
    setSearchApptQuery(appt.patient_name);
    setApptResults([]);
  };

  const handleConfirm = async (id, amount) => {
    if (!window.confirm('Xác nhận thu cọc?')) return;
    try {
      setIsProcessing(true);
      await confirmDeposit(id, amount);
      toast.success('Xác nhận thành công!');
      fetchDeposits();
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateDeposit = async () => {
    if (!selectedAppt) return toast.error('Chọn một lịch hẹn!');
    try {
      setIsProcessing(true);
      await confirmDeposit(selectedAppt.id, selectedAppt.amount);
      toast.success('Tạo đặt cọc thành công!');
      setShowAddModal(false);
      setSelectedAppt(null);
      setSearchApptQuery('');
      fetchDeposits();
    } catch {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsProcessing(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setSelectedAppt(null);
    setSearchApptQuery('');
    setApptResults([]);
  };

  return (
    <div className="dep-layout">
      <AccountantSidebar activePage="deposits" />
      <Toaster position="top-right" />

      <div className="dep-main">
        {/* Top Bar */}
        <header className="dep-topbar">
          <span className="dep-topbar__title">Quản Lý Tài Chính Phòng Khám</span>
          <div className="dep-topbar__avatar">
            <img src="https://ui-avatars.com/api/?name=KT&background=0ea5e9&color=fff&size=36" alt="avatar" />
          </div>
        </header>

        {/* Page Content */}
        <section className="dep-page">
          <div className="dep-page__header">
            <h1>Quản lý cọc đặt lịch</h1>
            <p>Màn hình quản lý cọc đặt lịch cho phép bạn theo dõi và quản lý các khoản cọc của bệnh nhân.</p>
          </div>

          {/* Filter Row */}
          <div className="dep-filter-row">
            <div className="dep-search">
              <FiSearch className="dep-search__icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo bệnh nhân, mã đặt lịch..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="dep-filter-right">
              <select
                className="dep-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chưa cọc</option>
                <option value="confirmed">Đã cọc</option>
                <option value="refunded">Hoàn trả</option>
              </select>
              <button className="dep-btn-create" onClick={openAddModal}>
                Tạo đặt lịch mới
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="dep-table-card">
            <table className="dep-table">
              <thead>
                <tr>
                  <th>Mã đặt lịch</th>
                  <th>Bệnh nhân</th>
                  <th>Dịch vụ</th>
                  <th>Số tiền cọc</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="dep-empty"><FiLoader className="dep-spin" /> Đang tải...</td></tr>
                ) : paginatedDeposits.length === 0 ? (
                  <tr><td colSpan="7" className="dep-empty">Không có dữ liệu</td></tr>
                ) : (
                  paginatedDeposits.map((dep) => (
                    <tr key={dep.id}>
                      <td className="dep-td-code">{dep.code}</td>
                      <td>
                        <div className="dep-patient">
                          <span className="dep-patient__name">{dep.patient_name}</span>
                          <span className="dep-patient__phone">{dep.phone}</span>
                        </div>
                      </td>
                      <td>{dep.service}</td>
                      <td className="dep-td-amount">{formatCurrency(dep.amount)}</td>
                      <td>{dep.date}</td>
                      <td>
                        <span className={`dep-badge dep-badge--${STATUS_MAP[dep.status]?.cls}`}>
                          {STATUS_MAP[dep.status]?.label}
                        </span>
                      </td>
                      <td>
                        <div className="dep-actions">
                          <button
                            className="dep-act dep-act--confirm"
                            disabled={dep.status !== 'pending' || isProcessing}
                            onClick={() => handleConfirm(dep.id, dep.amount)}
                          >
                            Xác nhận
                          </button>
                          <button className="dep-act dep-act--refund" disabled={dep.status === 'refunded'}>
                            Hoàn trả
                          </button>
                          <button className="dep-act-icon">
                            <FiExternalLink size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer */}
            <div className="dep-table-footer">
              <span>Hiển thị {paginatedDeposits.length} trong số {filteredDeposits.length} kết quả</span>
              <div className="dep-pagination">
                <button className="dep-pg" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><FiChevronsLeft size={14} /></button>
                <button className="dep-pg" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FiChevronLeft size={14} /></button>
                <span className="dep-pg dep-pg--active">{currentPage}</span>
                <button className="dep-pg" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><FiChevronRight size={14} /></button>
                <button className="dep-pg" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><FiChevronsRight size={14} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright Footer */}
        <footer className="dep-copyright">
          © 2026 Quản Lý Tài Chính Phòng Khám. All rights reserved.
        </footer>
      </div>

      {/* Create New Deposit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="dep-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div
              className="dep-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="dep-modal__head">
                <h3>Tạo đặt lịch mới</h3>
                <button onClick={() => setShowAddModal(false)}><FiX size={20} /></button>
              </div>
              <div className="dep-modal__body">
                <div className="dep-field" style={{ position: 'relative' }}>
                  <label>Tìm kiếm bệnh nhân / mã đặt lịch</label>
                  <div className="dep-search-wrap">
                    <FiSearch className="dep-search-wrap__icon" />
                    <input
                      type="text"
                      placeholder="Nhập tên hoặc mã..."
                      value={searchApptQuery}
                      onChange={(e) => { setSearchApptQuery(e.target.value); setSelectedAppt(null); }}
                    />
                    {isSearchingAppt && <FiLoader className="dep-spin dep-search-wrap__loader" />}
                  </div>

                  {apptResults.length > 0 && (
                    <div className="dep-dropdown">
                      {apptResults.map(a => (
                        <div key={a.id} className="dep-dropdown__item" onClick={() => handleSelectAppt(a)}>
                          <div>
                            <strong>{a.patient_name}</strong>
                            <span>#{a.id.substring(0, 8)} • {a.service_name}</span>
                          </div>
                          <span className="dep-dropdown__price">{formatCurrency(a.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedAppt && (
                  <motion.div
                    className="dep-selected"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="dep-selected__row"><FiUser size={14} /> {selectedAppt.patient_name} ({selectedAppt.patient_code})</div>
                    <div className="dep-selected__row"><FiPhone size={14} /> {selectedAppt.phone || 'N/A'}</div>
                    <div className="dep-selected__row"><FiCalendar size={14} /> {selectedAppt.date}</div>
                    <div className="dep-selected__total">Số tiền cọc: <strong>{formatCurrency(selectedAppt.amount)}</strong></div>
                  </motion.div>
                )}
              </div>
              <div className="dep-modal__foot">
                <button className="dep-btn-create" onClick={handleCreateDeposit} disabled={!selectedAppt || isProcessing}>
                  {isProcessing ? <FiLoader className="dep-spin" /> : 'Xác nhận & Tạo cọc'}
                </button>
                <button className="dep-btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepositManagementPage;
