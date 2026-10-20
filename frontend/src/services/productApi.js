import authApi from "./authApi";

const productApi = {

  getProducts(params = {}) {
    return authApi
      .get("/products", {
        params: params,
      })
      .then((res) => res.data.data);
  },

  getProduct(id) {
    return authApi
      .get(`/products/${id}`)
      .then((res) => res.data.data);
  },

  createProduct(payload) {

    console.log("Sending Product");
    console.log(payload);

    return authApi
      .post("/products", payload)
      .then((res) => {

        console.log("Product Created");
        console.log(res.data);

        return res.data.data;
      });
  },

  updateProduct(id, payload) {
    return authApi
      .put(`/products/${id}`, payload)
      .then((res) => res.data.data);
  },

  deleteProduct(id) {
    return authApi
      .delete(`/products/${id}`)
      .then((res) => res.data.data);
  },

  searchProducts(keyword) {
    return authApi
      .get("/products/search", {
        params: { keyword },
      })
      .then((res) => res.data.data);
  },

  getMyProducts() {
    return authApi
      .get("/products/my-products")
      .then((res) => res.data.data);
  },

  uploadImages(productId, formData, onUploadProgress) {
    return authApi.post(
      `/products/${productId}/images`,
      formData,
      {
        onUploadProgress,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then((res) => res.data.data);
  },

  getImages(productId) {
    return authApi
      .get(`/products/${productId}/images`)
      .then((res) => res.data.data.map(img => ({ id: img.id, url: img.imageUrl })));
  },

  deleteImage(imageId) {
    return authApi
      .delete(`/images/${imageId}`)
      .then((res) => res.data.data);
  }

};

export default productApi;