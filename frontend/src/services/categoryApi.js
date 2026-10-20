import authApi from "./authApi";

const categoryApi = {

    async getCategories() {

        const response = await authApi.get("/categories");

        console.log("Category Response");
        console.log(response.data);

        return response.data.data;
    }

};

export default categoryApi;