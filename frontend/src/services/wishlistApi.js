// src/services/wishlistApi.js
import authApi from './authApi';

// All functions return the nested data field: response.data
const wishlistApi = {
  get: () => authApi.get('/wishlist/my-wishlist').then((res) => {
    return res.data.map(item => ({
      id: item.productId,
      title: item.title,
      price: item.price,
      brand: item.brand,
      image: item.thumbnail,
      seller: { name: item.sellerName }
    }));
  }),

  // POST /api/wishlist/add/{productId} – add product to wishlist
  add: (productId) =>
    authApi.post(`/wishlist/add/${productId}`).then((res) => res.data),

  // DELETE /api/wishlist/remove/{productId} – remove product from wishlist
  remove: (productId) =>
    authApi.delete(`/wishlist/remove/${productId}`).then((res) => res.data),
};

export default wishlistApi;
