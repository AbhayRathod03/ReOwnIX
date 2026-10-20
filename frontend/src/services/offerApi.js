import authApi from './authApi';

const offerApi = {
  makeOffer: (payload) =>
    authApi.post('/offers', payload).then((res) => res.data.data),

  getProductOffers: (productId) =>
    authApi.get(`/offers/product/${productId}`).then((res) => res.data.data),

  getMyOffers: () =>
    authApi.get('/offers/my-offers').then((res) => res.data.data),

  updateOfferStatus: (offerId, status) =>
    authApi.put(`/offers/${offerId}/status`, null, { params: { status } }).then((res) => res.data.data),
};

export default offerApi;
