import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

// authUtils.js or utils.js
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};