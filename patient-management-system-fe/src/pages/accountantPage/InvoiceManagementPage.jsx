import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { getPendingInvoices, payInvoice } from '../../api/accountantApi';
import { toast, Toaster } from 'react-hot-toast';
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

const STATUS_MAP = {
  paid: { label: 'Đã thanh toán', color: 'paid' },
  unpaid: { label: 'Chưa thanh toán', color: 'unpaid' },
  cancelled: { label: 'Đã huỷ', color: 'cancelled' },
};

const InvoiceManagementPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getPendingInvoices();
      const mapped = res.data.map(d => ({
        id: d.invoice_id,
        patient_name: d.Patients?.Users?.full_name || 'N/A',
        patient_code: d.patient_id?.substring(0,8).toUpperCase(),
        date: new Date(d.issued_at).toLocaleDateString('vi-VN'),
        status: d.payment_status,
        total: d.total_amount,
        deposit_applied: d.Appointments?.deposit_paid || 0,
        items: (d.InvoiceItems || []).map(i => ({
            name: i.item_name,
            qty: i.quantity,
            price: i.unit_price
        }))
      }));
      setInvoices(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách hóa đơn!');
    } finally {
      setLoading(false);
    }
  };

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

  const handleMarkPaid = async (id) => {
    if(!window.confirm("Bạn có chắc chắn xác nhận thanh toán hóa đơn này?")) return;
    try {
      setIsProcessing(true);
      await payInvoice(id, 'cash');
      toast.success('Thanh toán thành công!');
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="acc-inv-layout">
      <AccountantSidebar activePage="invoices" />
      <Toaster position="top-right" />

      <main className="acc-inv-main">
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
                      <td className="acc-inv-table__code">{inv.id.substring(0,8).toUpperCase()}</td>
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
              <h3>Chi tiết hoá đơn — {selectedInvoice.id.substring(0,8).toUpperCase()}</h3>
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
                  className="acc-inv-modal__btn acc-inv-modal__btn--paid hover:opacity-90 transition-opacity"
                  onClick={() => handleMarkPaid(selectedInvoice.id)}
                  disabled={isProcessing}
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
