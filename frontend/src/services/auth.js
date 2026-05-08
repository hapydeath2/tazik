import request from "./api";

export async function login(email, password) {
  return request("/Auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email, password) {
  return request("/Auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function getAccounts(token) {
  return request("/Auth/accounts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}