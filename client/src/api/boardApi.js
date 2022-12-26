import axios from './axios'

const boardApi = {
  create: () => axios.post('/boards'),
  getAll: () => axios.get('/boards'),
  updatePosition: (params) => axios.put('/boards', params),
  getOne: (id) => axios.get(`/boards/${id}`),
  update: (id, params) => axios.put(`/boards/${id}`, params),
  getFavourites: () => axios.get('/boards/favourites'),
  updateFavouritePosition: (params) => axios.put('/boards/favourites', params),
  delete: (id) => axios.delete(`/boards/${id}`),
}

export default boardApi