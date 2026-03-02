import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheckSquare,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiImage,
  FiMessageSquare,
} from 'react-icons/fi';
import AccountantSidebar from '../../components/accountant/AccountantSidebar';
import './PaymentConfirmationPage.css';

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

const MOCK_TRANSFERS = [
  {
    id: 'CK001',
    patient_name: 'Lê Hoàng Cường',
    patient_code: 'BN003',
    invoice_id: 'INV003',
    amount: 500000,
    transfer_date: '2026-03-02 09:15',
    bank: 'Vietcombank',
    status: 'pending',
    note: '',
    proof_url: 'https://placehold.co/400x600/e2e8f0/475569?text=Ảnh+CK+001',
  },
  {
    id: 'CK002',
    patient_name: 'Phạm Minh Đức',
    patient_code: 'BN004',
    invoice_id: 'INV004',
    amount: 2750000,
    transfer_date: '2026-03-02 08:30',
    bank: 'MB Bank',
    status: 'pending',
    note: '',
    proof_url: 'https://placehold.co/400x600/e2e8f0/475569?text=Ảnh+CK+002',
  },
  {
    id: 'CK003',
    patient_name: 'Đỗ Thị Giang',
    patient_code: 'BN007',
    invoice_id: 'INV007',
    amount: 500000,
    transfer_date: '2026-03-01 16:45',
    bank: 'Techcombank',
    status: 'pending',
    note: '',
    proof_url: 'https://placehold.co/400x600/e2e8f0/475569?text=Ảnh+CK+003',
  },
  {
    id: 'CK004',
    patient_name: 'Nguyễn Văn An',
    patient_code: 'BN001',
    invoice_id: 'INV001',
    amount: 750000,
    transfer_date: '2026-03-01 14:20',
    bank: 'BIDV',
    status: 'confirmed',
    note: 'Đã đối chiếu với sao kê',
    proof_url: 'https://placehold.co/400x600/ecfdf5/059669?text=Đã+xác+nhận',
  },
  {
    id: 'CK005',
    patient_name: 'Trần Thị Bình',
    patient_code: 'BN002',
    invoice_id: 'INV002',
    amount: 1100000,
    transfer_date: '2026-03-01 10:00',
    bank: 'Vietinbank',
    status: 'rejected',
    note: 'Số tiền không khớp với hoá đơn',
    proof_url: 'https://placehold.co/400x600/fee2e2/dc2626?text=Bị+từ+chối',
  },
  {
    id: 'CK006',
    patient_name: 'Vũ Quang Phú',
    patient_code: 'BN006',
    invoice_id: 'INV006',
    amount: 1200000,
    transfer_date: '2026-02-28 15:30',
    bank: 'ACB',
    status: 'confirmed',
    note: 'OK',
    proof_url: 'https://placehold.co/400x600/ecfdf5/059669?text=Đã+xác+nhận',
  },
];

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'pending' },
  confirmed: { label: 'Đã xác nhận', color: 'confirmed' },
  rejected: { label: 'Từ chối', color: 'rejected' },
};

const PaymentConfirmationPage = () => {
  const [transfers, setTransfers] = useState(MOCK_TRANSFERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchSearch =
        t.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.patient_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.invoice_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transfers, searchTerm, statusFilter]);

  const pendingCount = transfers.filter((t) => t.status === 'pending').length;

  const handleConfirm = (id) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'confirmed', note: 'Đã đối chiếu' } : t))
    );
    setSelectedTransfer(null);
  };

  const handleReject = (id) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rejected', note: rejectNote || 'Không hợp lệ' } : t))
    );
    setRejectNote('');
    setShowRejectModal(null);
    setSelectedTransfer(null);
  };

  return (
    <div className="acc-pay-layout">
      <AccountantSidebar activePage="payments" />

      <main className="acc-pay-main">
        <motion.div
          className="acc-pay-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="acc-pay-header" variants={itemVariants}>
            <div>
              <h1 className="acc-pay-header__title">
                <FiCheckSquare size={24} />
                Xác nhận chuyển khoản
              </h1>
              <p className="acc-pay-header__subtitle">
                Xác nhận hoặc từ chối các giao dịch chuyển khoản từ bệnh nhân
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="acc-pay-header__pending-badge">
                <span>{pendingCount}</span> chờ xác nhận
              </div>
            )}
          </motion.div>

          {/* Filters */}
          <motion.div className="acc-pay-filters" variants={itemVariants}>
            <div className="acc-pay-filters__search">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên BN, mã CK, mã HĐ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="acc-pay-filters__status">
              <FiFilter size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="acc-pay-table-wrap" variants={itemVariants}>
            <table className="acc-pay-table">
              <thead>
                <tr>
                  <th>Mã CK</th>
                  <th>Bệnh nhân</th>
                  <th>Mã HĐ</th>
                  <th>Số tiền</th>
                  <th>Ngân hàng</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="acc-pay-table__empty">
                      Không tìm thấy giao dịch
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((t) => (
                    <tr key={t.id} className={t.status === 'pending' ? 'acc-pay-table__row--pending' : ''}>
                      <td className="acc-pay-table__code">{t.id}</td>
                      <td className="acc-pay-table__name">{t.patient_name}</td>
                      <td className="acc-pay-table__invoice">{t.invoice_id}</td>
                      <td className="acc-pay-table__amount">{formatCurrency(t.amount)}</td>
                      <td>{t.bank}</td>
                      <td className="acc-pay-table__date">{t.transfer_date}</td>
                      <td>
                        <span className={`acc-pay-badge acc-pay-badge--${STATUS_MAP[t.status]?.color}`}>
                          {STATUS_MAP[t.status]?.label}
                        </span>
                      </td>
                      <td>
                        <div className="acc-pay-table__actions">
                          <button
                            className="acc-pay-action-btn acc-pay-action-btn--view"
                            onClick={() => setSelectedTransfer(t)}
                            title="Xem chi tiết"
                          >
                            <FiEye size={15} />
                          </button>
                          {t.status === 'pending' && (
                            <>
                              <button
                                className="acc-pay-action-btn acc-pay-action-btn--confirm"
                                onClick={() => handleConfirm(t.id)}
                                title="Xác nhận"
                              >
                                <FiCheck size={15} />
                              </button>
                              <button
                                className="acc-pay-action-btn acc-pay-action-btn--reject"
                                onClick={() => setShowRejectModal(t)}
                                title="Từ chối"
                              >
                                <FiX size={15} />
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
          <motion.footer className="acc-pay-footer" variants={itemVariants}>
            <p>Tổng: {filteredTransfers.length} giao dịch</p>
          </motion.footer>
        </motion.div>
      </main>

      {/* Detail Modal */}
      {selectedTransfer && (
        <div className="acc-pay-modal-overlay" onClick={() => setSelectedTransfer(null)}>
          <motion.div
            className="acc-pay-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="acc-pay-modal__header">
              <h3>Chi tiết chuyển khoản — {selectedTransfer.id}</h3>
              <button className="acc-pay-modal__close" onClick={() => setSelectedTransfer(null)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="acc-pay-modal__body">
              <div className="acc-pay-modal__info-grid">
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Bệnh nhân</span>
                  <span className="acc-pay-modal__value">{selectedTransfer.patient_name}</span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Mã BN</span>
                  <span className="acc-pay-modal__value">{selectedTransfer.patient_code}</span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Mã hoá đơn</span>
                  <span className="acc-pay-modal__value">{selectedTransfer.invoice_id}</span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Số tiền</span>
                  <span className="acc-pay-modal__value acc-pay-modal__value--strong">
                    {formatCurrency(selectedTransfer.amount)}
                  </span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Ngân hàng</span>
                  <span className="acc-pay-modal__value">{selectedTransfer.bank}</span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Thời gian</span>
                  <span className="acc-pay-modal__value">{selectedTransfer.transfer_date}</span>
                </div>
                <div className="acc-pay-modal__info-item">
                  <span className="acc-pay-modal__label">Trạng thái</span>
                  <span className={`acc-pay-badge acc-pay-badge--${STATUS_MAP[selectedTransfer.status]?.color}`}>
                    {STATUS_MAP[selectedTransfer.status]?.label}
                  </span>
                </div>
                {selectedTransfer.note && (
                  <div className="acc-pay-modal__info-item">
                    <span className="acc-pay-modal__label">Ghi chú</span>
                    <span className="acc-pay-modal__value">{selectedTransfer.note}</span>
                  </div>
                )}
              </div>

              <div className="acc-pay-modal__proof">
                <h4><FiImage size={16} /> Hình ảnh minh chứng</h4>
                <div className="acc-pay-modal__proof-img">
                  <img src={selectedTransfer.proof_url} alt="Minh chứng chuyển khoản" />
                </div>
              </div>
            </div>
            <div className="acc-pay-modal__footer">
              {selectedTransfer.status === 'pending' && (
                <>
                  <button
                    className="acc-pay-modal__btn acc-pay-modal__btn--confirm"
                    onClick={() => handleConfirm(selectedTransfer.id)}
                  >
                    <FiCheck size={16} /> Xác nhận
                  </button>
                  <button
                    className="acc-pay-modal__btn acc-pay-modal__btn--reject"
                    onClick={() => {
                      setSelectedTransfer(null);
                      setShowRejectModal(selectedTransfer);
                    }}
                  >
                    <FiX size={16} /> Từ chối
                  </button>
                </>
              )}
              <button
                className="acc-pay-modal__btn acc-pay-modal__btn--close"
                onClick={() => setSelectedTransfer(null)}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="acc-pay-modal-overlay" onClick={() => setShowRejectModal(null)}>
          <motion.div
            className="acc-pay-modal acc-pay-modal--small"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="acc-pay-modal__header acc-pay-modal__header--danger">
              <h3>Từ chối chuyển khoản — {showRejectModal.id}</h3>
              <button className="acc-pay-modal__close" onClick={() => setShowRejectModal(null)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="acc-pay-modal__body">
              <p className="acc-pay-reject-info">
                Bệnh nhân: <strong>{showRejectModal.patient_name}</strong> — {formatCurrency(showRejectModal.amount)}
              </p>
              <div className="acc-pay-form-group">
                <label><FiMessageSquare size={14} /> Lý do từ chối</label>
                <textarea
                  placeholder="Nhập lý do từ chối..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="acc-pay-modal__footer">
              <button
                className="acc-pay-modal__btn acc-pay-modal__btn--reject"
                onClick={() => handleReject(showRejectModal.id)}
              >
                <FiX size={16} /> Xác nhận từ chối
              </button>
              <button
                className="acc-pay-modal__btn acc-pay-modal__btn--close"
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectNote('');
                }}
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

export default PaymentConfirmationPage;
