import dotnetApi from './dotnetApi';

export const planService = {
  getAllPlans: () => dotnetApi.get('/Plan'),
  getPlanById: (id) => dotnetApi.get(`/Plan/${id}`),
  createPlan: (data) => dotnetApi.post('/Plan', data),
  updatePlan: (id, data) => dotnetApi.put(`/Plan/${id}`, data),
  deletePlan: (id) => dotnetApi.delete(`/Plan/${id}`),
};
