const API_URL = 'http://localhost:3000/tickets'; 

export const TicketService = {
  async getAll() {
    const response = await fetch(API_URL);
    return await response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  },

  async create(ticket) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await response.json();
  },

  async update(id, ticket) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
};