const API_URL = "https://localhost:7099/api";

export async function getProducts() {
    const res = await fetch(`${API_URL}/Products`);
    return res.json();
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    return res.json();
}