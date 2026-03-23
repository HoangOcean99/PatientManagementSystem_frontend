import axiosClient from "./axiosClient";

export const getDashboardStats = async () => {
  const response = await axiosClient.get("/accountant/dashboard-stats");
  return response.data;
};

export const getPendingDeposits = async () => {
  const response = await axiosClient.get("/accountant/pending-deposits");
  return response.data;
};

export const getPendingInvoices = async () => {
  const response = await axiosClient.get("/accountant/pending-invoices");
  return response.data;
};

export const confirmDeposit = async (appointmentId, amount) => {
  const payload = amount ? { amount } : {};
  const response = await axiosClient.put(`/accountant/appointments/${appointmentId}/deposit`, payload);
  return response.data;
};

export const payInvoice = async (invoiceId, paymentMethod) => {
  const payload = paymentMethod ? { payment_method: paymentMethod } : {};
  const response = await axiosClient.put(`/accountant/invoices/${invoiceId}/pay`, payload);
  return response.data;
};

export const searchApptsForDeposit = async (query) => {
  const response = await axiosClient.get(`/accountant/search-appts-for-deposit?query=${query}`);
  return response.data;
};
