import axios from './axios'

const taskApi = {
  create: (boardId, params) => axios.post(`/boards/${boardId}/tasks`, params),
  update: (boardId, taskId, params) => axios.put(`/boards/${boardId}/tasks/${taskId}`, params),
  updatePosition: (boardId, params) => axios.put(`/boards/${boardId}/tasks/update-position`, params),
  delete: (boardId, taskId) => axios.delete(`/boards/${boardId}/tasks/${taskId}`),
}

export default taskApi