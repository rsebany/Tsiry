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

const ticketService = {
  getTicketStatus: async (ticketId) => {
    const { data } = await api.get(`/tickets/${ticketId}/status`);
    return data.data;
  },
};

export default ticketService;
