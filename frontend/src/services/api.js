import axios from 'axios';

const API = axios.create({
    baseURL: '/api/v1',
});

// Add a request interceptor to add the token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => API.post('/login', data);
export const signup = (data) => API.post('/signup', data);

export const getNotes = () => API.get('/notes');
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.put(`/notes/${id}/trash`);
export const restoreNote = (id) => API.put(`/notes/${id}/restore`);
export const permanentDeleteNote = (id) => API.delete(`/notes/${id}/permanent`);
export const toggleArchive = (id) => API.put(`/notes/${id}/archive`);
export const togglePin = (id) => API.put(`/notes/${id}/pin`);
export const updateLabels = (id, labels) => API.put(`/notes/${id}/labels`, { labels });
export const addCollaborator = (id, email) => API.post(`/notes/${id}/collaborators`, { email });
export const removeCollaborator = (id, collaboratorId) => API.delete(`/notes/${id}/collaborators/${collaboratorId}`);
export const getLabels = () => API.get('/notes/labels');
export const createLabel = (labelName) => API.post('/notes/labels', { labelName });
export const renameLabel = (oldName, newName) => API.put('/notes/labels/rename', { oldName, newName });
export const deleteLabel = (labelName) => API.delete('/notes/labels/delete', { data: { labelName } });

export default API;
