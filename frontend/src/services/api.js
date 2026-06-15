import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

const ticketApi = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const ticketService = {
  getTicketStatus: async (ticketId) => {
    const { data } = await ticketApi.get(`/tickets/${ticketId}/status`);
    return data.data;
  },
};

export default ticketService;
