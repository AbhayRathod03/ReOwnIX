import dotnetApi from './dotnetApi';

export const subscriptionService = {
  purchaseSubscription: (data) => dotnetApi.post('/Subscription/purchase', data),
  recordProductView: (userId) => dotnetApi.post(`/Subscription/view/${userId}`),
  getRemainingViews: (userId) => dotnetApi.get(`/Subscription/remaining/${userId}`),
  checkCanViewProduct: (userId) => dotnetApi.get(`/Subscription/canview/${userId}`),
  checkIsExpired: (userId) => dotnetApi.get(`/Subscription/isexpired/${userId}`),
  getUserSubscription: (userId) => dotnetApi.get(`/Subscription/user/${userId}`),
  renewSubscription: (userId) => dotnetApi.post(`/Subscription/renew/${userId}`),
  cancelSubscription: (userId) => dotnetApi.post(`/Subscription/cancel/${userId}`),
};
