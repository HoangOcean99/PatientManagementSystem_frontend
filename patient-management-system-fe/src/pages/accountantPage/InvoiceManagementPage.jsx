import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiSearch,
  FiFilter,
  FiEye,
  FiPrinter,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import AccountantSidebar from '../../components/accountant/AccountantSidebar';
import InvoicePrintTemplate from '../../components/accountant/InvoicePrintTemplate';
import './InvoiceManagementPage.css';

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

const MOCK_INVOICES = [
  {
    id: 'INV001',
    patient_name: 'Nguyễn Văn An',
    patient_code: 'BN001',
    date: '2026-03-02',
    status: 'paid',
    total: 1250000,
    deposit_applied: 500000,
    items: [
      { name: 'Khám tổng quát', qty: 1, price: 300000 },
      { name: 'Xét nghiệm máu CBC', qty: 1, price: 250000 },
      { name: 'Xét nghiệm nước tiểu', qty: 1, price: 200000 },
      { name: 'Thuốc Paracetamol 500mg', qty: 20, price: 5000 },
      { name: 'Thuốc Amoxicillin 250mg', qty: 14, price: 25000 },
    ],
  },
  {
    id: 'INV002',
    patient_name: 'Trần Thị Bình',
    patient_code: 'BN002',
    date: '2026-03-02',
    status: 'unpaid',
    total: 2100000,
    deposit_applied: 1000000,
    items: [
      { name: 'Khám chuyên khoa Tim', qty: 1, price: 500000 },
      { name: 'Siêu âm tim', qty: 1, price: 800000 },
      { name: 'Điện tâm đồ', qty: 1, price: 300000 },
      { name: 'Thuốc Aspirin 81mg', qty: 30, price: 3000 },
      { name: 'Thuốc Atorvastatin 20mg', qty: 30, price: 12000 },
    ],
  },
  {
    id: 'INV003',
    patient_name: 'Lê Hoàng Cường',
    patient_code: 'BN003',
    date: '2026-03-01',
    status: 'paid',
    total: 800000,
    deposit_applied: 300000,
    items: [
      { name: 'Khám tổng quát', qty: 1, price: 300000 },
      { name: 'Xét nghiệm đường huyết', qty: 1, price: 150000 },
      { name: 'Thuốc Metformin 500mg', qty: 30, price: 8000 },
      { name: 'Thuốc Vitamin B12', qty: 30, price: 3667 },
    ],
  },
  {
    id: 'INV004',
    patient_name: 'Phạm Minh Đức',
    patient_code: 'BN004',
    date: '2026-03-01',
    status: 'unpaid',
    total: 3500000,
    deposit_applied: 750000,
    items: [
      { name: 'Tiểu phẫu (khâu vết thương)', qty: 1, price: 2000000 },
      { name: 'Gây tê tại chỗ', qty: 1, price: 500000 },
      { name: 'Vật tư y tế (chỉ khâu, gạc)', qty: 1, price: 300000 },
      { name: 'Thuốc kháng sinh Cefixime', qty: 10, price: 35000 },
      { name: 'Thuốc giảm đau Ibuprofen', qty: 14, price: 25000 },
    ],
  },
  {
    id: 'INV005',
    patient_name: 'Hoàng Thị Em',
    patient_code: 'BN005',
    date: '2026-02-28',
    status: 'cancelled',
    total: 450000,
    deposit_applied: 0,
    items: [
      { name: 'Khám nội khoa', qty: 1, price: 250000 },
      { name: 'Xét nghiệm mỡ máu', qty: 1, price: 200000 },
    ],
  },
  {
    id: 'INV006',
    patient_name: 'Vũ Quang Phú',
    patient_code: 'BN006',
    date: '2026-02-28',
    status: 'paid',
    total: 1800000,
    deposit_applied: 600000,
    items: [
      { name: 'Khám chuyên khoa Nội tiết', qty: 1, price: 500000 },
      { name: 'Xét nghiệm tuyến giáp TSH', qty: 1, price: 350000 },
      { name: 'Siêu âm tuyến giáp', qty: 1, price: 400000 },
      { name: 'Thuốc Levothyroxine 50mcg', qty: 30, price: 10000 },
      { name: 'Thuốc Selenium 200mcg', qty: 30, price: 8333 },
    ],
  },
  {
    id: 'INV007',
    patient_name: 'Đỗ Thị Giang',
    patient_code: 'BN007',
    date: '2026-02-27',
    status: 'unpaid',
    total: 950000,
    deposit_applied: 450000,
    items: [
      { name: 'Khám nội khoa', qty: 1, price: 250000 },
      { name: 'Xét nghiệm máu CBC', qty: 1, price: 250000 },
      { name: 'Thuốc bổ sắt Ferrous Sulfate', qty: 30, price: 5000 },
      { name: 'Vitamin C 500mg', qty: 30, price: 10000 },
    ],
  },
  {
    id: 'INV008',
    patient_name: 'Bùi Văn Hùng',
    patient_code: 'BN008',
    date: '2026-02-27',
    status: 'paid',
    total: 4200000,
    deposit_applied: 1500000,
    items: [
      { name: 'Nội soi dạ dày', qty: 1, price: 2500000 },
      { name: 'Sinh thiết (nếu cần)', qty: 1, price: 800000 },
      { name: 'Gây mê nhẹ', qty: 1, price: 500000 },
      { name: 'Thuốc PPI Omeprazole 20mg', qty: 28, price: 10000 },
      { name: 'Thuốc Domperidone 10mg', qty: 21, price: 6667 },
    ],
  },
];

const STATUS_MAP = {
  paid: { label: 'Đã thanh toán', color: 'paid' },
  unpaid: { label: 'Chưa thanh toán', color: 'unpaid' },
  cancelled: { label: 'Đã huỷ', color: 'cancelled' },
};

const InvoiceManagementPage = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.patient_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleMarkPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
    setSelectedInvoice(null);
  };

  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="acc-inv-layout" style={{ width: '100vw' }}>
      <main className="acc-inv-main p-8">
        <motion.div
          className="acc-inv-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="acc-inv-header" variants={itemVariants}>
            <div>
              <h1 className="acc-inv-header__title">
                <FiFileText size={24} />
                Quản lý hoá đơn
              </h1>
              <p className="acc-inv-header__subtitle">
                Quản lý, in ấn và xuất hoá đơn bệnh nhân
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div className="acc-inv-filters" variants={itemVariants}>
            <div className="acc-inv-filters__search">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên BN, mã BN, mã HĐ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="acc-inv-filters__status">
              <FiFilter size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="acc-inv-table-wrap" variants={itemVariants}>
            <table className="acc-inv-table">
              <thead>
                <tr>
                  <th>Mã HĐ</th>
                  <th>Bệnh nhân</th>
                  <th>Mã BN</th>
                  <th>Ngày</th>
                  <th>Tổng tiền</th>
                  <th>Đặt cọc</th>
                  <th>Còn lại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="acc-inv-table__empty">
                      Không tìm thấy hoá đơn
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="acc-inv-table__code">{inv.id}</td>
                      <td className="acc-inv-table__name">{inv.patient_name}</td>
                      <td>{inv.patient_code}</td>
                      <td>{inv.date}</td>
                      <td className="acc-inv-table__amount">{formatCurrency(inv.total)}</td>
                      <td className="acc-inv-table__deposit">
                        {inv.deposit_applied > 0 ? `-${formatCurrency(inv.deposit_applied)}` : '—'}
                      </td>
                      <td className="acc-inv-table__remaining">
                        {formatCurrency(inv.total - inv.deposit_applied)}
                      </td>
                      <td>
                        <span className={`acc-inv-badge acc-inv-badge--${STATUS_MAP[inv.status]?.color}`}>
                          {STATUS_MAP[inv.status]?.label}
                        </span>
                      </td>
                      <td>
                        <div className="acc-inv-table__actions">
                          <button
                            className="acc-inv-action-btn acc-inv-action-btn--view"
                            onClick={() => setSelectedInvoice(inv)}
                            title="Xem chi tiết"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            className="acc-inv-action-btn acc-inv-action-btn--print"
                            onClick={() => handlePrint(inv)}
                            title="In hoá đơn"
                          >
                            <FiPrinter size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Footer */}
          <motion.footer className="acc-inv-footer" variants={itemVariants}>
            <p>Tổng: {filteredInvoices.length} hoá đơn</p>
          </motion.footer>
        </motion.div>
      </main>

      {/* Detail Modal */}
      {selectedInvoice && (
        <div className="acc-inv-modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <motion.div
            className="acc-inv-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="acc-inv-modal__header">
              <h3>Chi tiết hoá đơn — {selectedInvoice.id}</h3>
              <button className="acc-inv-modal__close" onClick={() => setSelectedInvoice(null)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="acc-inv-modal__body">
              <div className="acc-inv-modal__info-grid">
                <div className="acc-inv-modal__info-item">
                  <span className="acc-inv-modal__label">Bệnh nhân</span>
                  <span className="acc-inv-modal__value">{selectedInvoice.patient_name}</span>
                </div>
                <div className="acc-inv-modal__info-item">
                  <span className="acc-inv-modal__label">Mã BN</span>
                  <span className="acc-inv-modal__value">{selectedInvoice.patient_code}</span>
                </div>
                <div className="acc-inv-modal__info-item">
                  <span className="acc-inv-modal__label">Ngày xuất</span>
                  <span className="acc-inv-modal__value">{selectedInvoice.date}</span>
                </div>
                <div className="acc-inv-modal__info-item">
                  <span className="acc-inv-modal__label">Trạng thái</span>
                  <span className={`acc-inv-badge acc-inv-badge--${STATUS_MAP[selectedInvoice.status]?.color}`}>
                    {STATUS_MAP[selectedInvoice.status]?.label}
                  </span>
                </div>
              </div>

              <div className="acc-inv-modal__items-table">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Dịch vụ / Thuốc</th>
                      <th>SL</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className="acc-inv-modal__item-total">
                          {formatCurrency(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="acc-inv-modal__summary">
                <div className="acc-inv-modal__summary-row">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
                {selectedInvoice.deposit_applied > 0 && (
                  <div className="acc-inv-modal__summary-row acc-inv-modal__summary-row--deposit">
                    <span>Đã đặt cọc:</span>
                    <span>-{formatCurrency(selectedInvoice.deposit_applied)}</span>
                  </div>
                )}
                <div className="acc-inv-modal__summary-row acc-inv-modal__summary-row--total">
                  <span>Còn phải trả:</span>
                  <span>{formatCurrency(selectedInvoice.total - selectedInvoice.deposit_applied)}</span>
                </div>
              </div>
            </div>
            <div className="acc-inv-modal__footer">
              {selectedInvoice.status === 'unpaid' && (
                <button
                  className="acc-inv-modal__btn acc-inv-modal__btn--paid"
                  onClick={() => handleMarkPaid(selectedInvoice.id)}
                >
                  <FiCheckCircle size={16} /> Đánh dấu đã TT
                </button>
              )}
              <button
                className="acc-inv-modal__btn acc-inv-modal__btn--print"
                onClick={() => {
                  setSelectedInvoice(null);
                  handlePrint(selectedInvoice);
                }}
              >
                <FiPrinter size={16} /> In hoá đơn
              </button>
              <button
                className="acc-inv-modal__btn acc-inv-modal__btn--close"
                onClick={() => setSelectedInvoice(null)}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Print Template (hidden, only shows when printing) */}
      {printInvoice && (
        <InvoicePrintTemplate
          invoice={printInvoice}
          onAfterPrint={() => setPrintInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoiceManagementPage;
