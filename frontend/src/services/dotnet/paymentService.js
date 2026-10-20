import dotnetApi from './dotnetApi';

export const paymentService = {
  getAllPayments: () => dotnetApi.get('/Payment'),
  getPaymentById: (id) => dotnetApi.get(`/Payment/${id}`),
  processPayment: (data) => dotnetApi.post('/Payment', data),
  deletePayment: (id) => dotnetApi.delete(`/Payment/${id}`),
};
