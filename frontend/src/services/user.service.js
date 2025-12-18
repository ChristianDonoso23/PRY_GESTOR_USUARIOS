const API_URL = "http://localhost:3000/users";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const UserService = {
getAll: async () => {
    const res = await fetch(API_URL, {
        headers: authHeaders(),
    });
    return res.json();
},

create: async (user) => {
    await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(user),
    });
},

update: async (id, user) => {
        await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(user),
    });
},

delete: async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
},
};
