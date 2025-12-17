const API_URL = "http://localhost:3000/users";

export const UserService = {
    getAll: async () => {
        const res = await fetch(API_URL);
        return res.json();
    },

    create: async (user) => {
        await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
        });
    },

    update: async (id, user) => {
        await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
        });
    },

    delete: async (id) => {
        await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
        });
    }
};
