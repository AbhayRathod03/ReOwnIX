// src/services/auctionApi.js
import authApi from './authApi';

// All functions return the nested data field: response.data.data
const auctionApi = {
  // POST /api/auctions – create a new auction
  create: (payload) =>
    authApi.post('/auctions', payload).then((res) => res.data.data),

  // PUT /api/auctions/{id} – update an existing auction
  update: (auctionId, payload) =>
    authApi.put(`/auctions/${auctionId}`, payload).then((res) => res.data.data),

  // DELETE /api/auctions/{id} – cancel (delete) an auction
  cancel: (auctionId) =>
    authApi.delete(`/auctions/${auctionId}`).then((res) => res.data.data),

  // GET /api/auctions?status=active – list active auctions
  getActiveAuctions: () =>
    authApi.get('/auctions', { params: { status: 'active' } }).then((res) => res.data.data),

  // GET /api/auctions/{id} – get auction details
  getAuctionDetails: (auctionId) =>
    authApi.get(`/auctions/${auctionId}`).then((res) => res.data.data),
    
  // GET /api/auctions/product/{productId} - get auction by product id
  getAuctionByProductId: (productId) =>
    authApi.get(`/auctions/product/${productId}`).then((res) => res.data.data),

  // GET /api/auctions/{id}/bids – get bid history for an auction
  getBidHistory: (auctionId) =>
    authApi.get(`/auctions/${auctionId}/bids`).then((res) => res.data.data),

  // POST /api/auctions/{id}/bids – place a new bid
  placeBid: (auctionId, payload) =>
    authApi.post(`/auctions/${auctionId}/bids`, payload).then((res) => res.data.data),

  // GET /api/auctions/my-bids
  getMyBids: () =>
    authApi.get('/auctions/my-bids').then((res) => res.data.data),

};

export default auctionApi;
