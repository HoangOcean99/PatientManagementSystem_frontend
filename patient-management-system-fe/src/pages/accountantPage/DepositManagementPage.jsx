import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEye,
  FiRotateCcw,
  FiCheck,
  FiX,
  FiLoader,
} from 'react-icons/fi';
import AccountantSidebar from '../../components/accountant/AccountantSidebar';
import './DepositManagementPage.css';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const MOCK_DEPOSITS = [
  { id: 'DEP001', patient_name: 'Nguyễn Văn An', patient_code: 'BN001', amount: 500000, date: '2026-03-02', status: 'pending', note: 'Đặt cọc khám tổng quát' },
  { id: 'DEP002', patient_name: 'Trần Thị Bình', patient_code: 'BN002', amount: 1000000, date: '2026-03-02', status: 'confirmed', note: 'Đặt cọc xét nghiệm' },
  { id: 'DEP003', patient_name: 'Lê Hoàng Cường', patient_code: 'BN003', amount: 300000, date: '2026-03-01', status: 'applied', note: 'Đã chuyển sang hoá đơn' },
  { id: 'DEP004', patient_name: 'Phạm Minh Đức', patient_code: 'BN004', amount: 750000, date: '2026-03-01', status: 'confirmed', note: 'Đặt cọc phẫu thuật nhỏ' },
  { id: 'DEP005', patient_name: 'Hoàng Thị Em', patient_code: 'BN005', amount: 200000, date: '2026-02-28', status: 'refunded', note: 'Hoàn cọc - BN huỷ lịch' },
  { id: 'DEP006', patient_name: 'Vũ Quang Phú', patient_code: 'BN006', amount: 600000, date: '2026-02-28', status: 'pending', note: 'Đặt cọc khám chuyên khoa' },
  { id: 'DEP007', patient_name: 'Đỗ Thị Giang', patient_code: 'BN007', amount: 450000, date: '2026-02-27', status: 'confirmed', note: 'Đặt cọc xét nghiệm máu' },
  { id: 'DEP008', patient_name: 'Bùi Văn Hùng', patient_code: 'BN008', amount: 1500000, date: '2026-02-27', status: 'applied', note: 'Đã chuyển sang hoá đơn' },
  { id: 'DEP009', patient_name: 'Ngô Thị Lan', patient_code: 'BN009', amount: 350000, date: '2026-02-26', status: 'pending', note: 'Đặt cọc tái khám' },
  { id: 'DEP010', patient_name: 'Lý Minh Khôi', patient_code: 'BN010', amount: 800000, date: '2026-02-26', status: 'refunded', note: 'Hoàn cọc - chuyển viện' },
];

const STATUS_MAP = {
  pending: { label: 'Chờ xử lý', color: 'pending' },
  confirmed: { label: 'Đã xác nhận', color: 'confirmed' },
  applied: { label: 'Đã áp dụng HĐ', color: 'applied' },
  refunded: { label: 'Đã hoàn cọc', color: 'refunded' },
};

const DepositManagementPage = () => {
  const [deposits, setDeposits] = useState(MOCK_DEPOSITS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((dep) => {
      const matchSearch =
        dep.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.patient_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || dep.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deposits, searchTerm, statusFilter]);

  const handleConfirm = (id) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'confirmed' } : d))
    );
    setSelectedDeposit(null);
  };

  const handleRefund = (id) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'refunded' } : d))
    );
    setSelectedDeposit(null);
  };

  const handleApply = (id) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'applied' } : d))
    );
    setSelectedDeposit(null);
  };

  return (
    <div className="acc-dep-layout">
      <AccountantSidebar activePage="deposits" />

      <main className="acc-dep-main">
        <motion.div
          className="acc-dep-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="acc-dep-header" variants={itemVariants}>
            <div>
              <h1 className="acc-dep-header__title">
                <FiDollarSign size={24} />
                Quản lý tiền đặt cọc
              </h1>
              <p className="acc-dep-header__subtitle">Theo dõi và quản lý tiền đặt cọc bệnh nhân</p>
            </div>
            <button className="acc-dep-header__add-btn" onClick={() => setShowAddModal(true)}>
              <FiPlus size={18} />
              Thêm đặt cọc
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div className="acc-dep-filters" variants={itemVariants}>
            <div className="acc-dep-filters__search">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên BN, mã BN, mã đặt cọc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="acc-dep-filters__status">
              <FiFilter size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="applied">Đã áp dụng HĐ</option>
                <option value="refunded">Đã hoàn cọc</option>
              </select>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="acc-dep-table-wrap" variants={itemVariants}>
            <table className="acc-dep-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Bệnh nhân</th>
                  <th>Mã BN</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="acc-dep-table__empty">
                      Không tìm thấy kết quả
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((dep) => (
                    <tr key={dep.id}>
                      <td className="acc-dep-table__code">{dep.id}</td>
                      <td className="acc-dep-table__name">{dep.patient_name}</td>
                      <td>{dep.patient_code}</td>
                      <td className="acc-dep-table__amount">{formatCurrency(dep.amount)}</td>
                      <td>{dep.date}</td>
                      <td>
                        <span className={`acc-dep-badge acc-dep-badge--${STATUS_MAP[dep.status]?.color}`}>
                          {STATUS_MAP[dep.status]?.label}
                        </span>
                      </td>
                      <td>
                        <div className="acc-dep-table__actions">
                          <button
                            className="acc-dep-action-btn acc-dep-action-btn--view"
                            onClick={() => setSelectedDeposit(dep)}
                            title="Xem chi tiết"
                          >
                            <FiEye size={15} />
                          </button>
                          {dep.status === 'pending' && (
                            <button
                              className="acc-dep-action-btn acc-dep-action-btn--confirm"
                              onClick={() => handleConfirm(dep.id)}
                              title="Xác nhận"
                            >
                              <FiCheck size={15} />
                            </button>
                          )}
                          {dep.status === 'confirmed' && (
                            <>
                              <button
                                className="acc-dep-action-btn acc-dep-action-btn--apply"
                                onClick={() => handleApply(dep.id)}
                                title="Áp dụng vào HĐ"
                              >
                                <FiDollarSign size={15} />
                              </button>
                              <button
                                className="acc-dep-action-btn acc-dep-action-btn--refund"
                                onClick={() => handleRefund(dep.id)}
                                title="Hoàn cọc"
                              >
                                <FiRotateCcw size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Footer */}
          <motion.footer className="acc-dep-footer" variants={itemVariants}>
            <p>Tổng: {filteredDeposits.length} đặt cọc</p>
          </motion.footer>
        </motion.div>
      </main>

      {/* Detail Modal */}
      {selectedDeposit && (
        <div className="acc-dep-modal-overlay" onClick={() => setSelectedDeposit(null)}>
          <motion.div
            className="acc-dep-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="acc-dep-modal__header">
              <h3>Chi tiết đặt cọc — {selectedDeposit.id}</h3>
              <button className="acc-dep-modal__close" onClick={() => setSelectedDeposit(null)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="acc-dep-modal__body">
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Bệnh nhân:</span>
                <span className="acc-dep-modal__value">{selectedDeposit.patient_name}</span>
              </div>
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Mã BN:</span>
                <span className="acc-dep-modal__value">{selectedDeposit.patient_code}</span>
              </div>
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Số tiền:</span>
                <span className="acc-dep-modal__value acc-dep-modal__value--strong">
                  {formatCurrency(selectedDeposit.amount)}
                </span>
              </div>
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Ngày đặt cọc:</span>
                <span className="acc-dep-modal__value">{selectedDeposit.date}</span>
              </div>
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Trạng thái:</span>
                <span className={`acc-dep-badge acc-dep-badge--${STATUS_MAP[selectedDeposit.status]?.color}`}>
                  {STATUS_MAP[selectedDeposit.status]?.label}
                </span>
              </div>
              <div className="acc-dep-modal__row">
                <span className="acc-dep-modal__label">Ghi chú:</span>
                <span className="acc-dep-modal__value">{selectedDeposit.note}</span>
              </div>
            </div>
            <div className="acc-dep-modal__footer">
              {selectedDeposit.status === 'pending' && (
                <button
                  className="acc-dep-modal__btn acc-dep-modal__btn--confirm"
                  onClick={() => handleConfirm(selectedDeposit.id)}
                >
                  <FiCheck size={16} /> Xác nhận
                </button>
              )}
              {selectedDeposit.status === 'confirmed' && (
                <>
                  <button
                    className="acc-dep-modal__btn acc-dep-modal__btn--apply"
                    onClick={() => handleApply(selectedDeposit.id)}
                  >
                    <FiDollarSign size={16} /> Áp dụng vào HĐ
                  </button>
                  <button
                    className="acc-dep-modal__btn acc-dep-modal__btn--refund"
                    onClick={() => handleRefund(selectedDeposit.id)}
                  >
                    <FiRotateCcw size={16} /> Hoàn cọc
                  </button>
                </>
              )}
              <button
                className="acc-dep-modal__btn acc-dep-modal__btn--close"
                onClick={() => setSelectedDeposit(null)}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add New Deposit Modal */}
      {showAddModal && (
        <div className="acc-dep-modal-overlay" onClick={() => setShowAddModal(false)}>
          <motion.div
            className="acc-dep-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="acc-dep-modal__header">
              <h3>Thêm đặt cọc mới</h3>
              <button className="acc-dep-modal__close" onClick={() => setShowAddModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="acc-dep-modal__body">
              <div className="acc-dep-form-group">
                <label>Tên bệnh nhân</label>
                <input type="text" placeholder="Nhập tên bệnh nhân..." />
              </div>
              <div className="acc-dep-form-group">
                <label>Mã bệnh nhân</label>
                <input type="text" placeholder="VD: BN011" />
              </div>
              <div className="acc-dep-form-group">
                <label>Số tiền đặt cọc (VNĐ)</label>
                <input type="number" placeholder="500000" />
              </div>
              <div className="acc-dep-form-group">
                <label>Ghi chú</label>
                <textarea placeholder="Nhập ghi chú..." rows={3}></textarea>
              </div>
            </div>
            <div className="acc-dep-modal__footer">
              <button className="acc-dep-modal__btn acc-dep-modal__btn--confirm">
                <FiPlus size={16} /> Tạo đặt cọc
              </button>
              <button
                className="acc-dep-modal__btn acc-dep-modal__btn--close"
                onClick={() => setShowAddModal(false)}
              >
                Huỷ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DepositManagementPage;
