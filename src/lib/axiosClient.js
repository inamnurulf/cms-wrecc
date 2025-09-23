import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  withCredentials: false, // using tokens in headers, not cookies
  timeout: 15000,
});

// We set Authorization header in the baseQuery (so tokens update correctly)
export default axiosClient;
