import dotnetApi from './dotnetApi';

export const invoiceService = {
  getAllInvoices: () => dotnetApi.get('/Invoice'),
  getInvoiceById: (id) => dotnetApi.get(`/Invoice/${id}`),
  generateInvoice: (data) => dotnetApi.post('/Invoice', data),
  updateInvoice: (id, data) => dotnetApi.put(`/Invoice/${id}`, data),
  deleteInvoice: (id) => dotnetApi.delete(`/Invoice/${id}`),
};
