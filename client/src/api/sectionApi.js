import axios from './axios'

const sectionApi = {
  create: (boardId) => axios.post(`/boards/${boardId}/sections`),
  update: (boardId, sectionId, params) => axios.put(`/boards/${boardId}/sections/${sectionId}`, params),
  delete: (boardId, sectionId) => axios.delete(`/boards/${boardId}/sections/${sectionId}`),
}

export default sectionApi