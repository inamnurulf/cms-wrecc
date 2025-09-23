import axiosClient from "./axiosClient";
import { setAccessToken, logout } from "../store/slices/auth.slice";

const axiosBaseQuery = ({ prepareHeaders } = {}) => {
  return async ({ url, method, data, params, headers }, api) => {
    try {
      const state = api.getState();
      const hdrs = typeof prepareHeaders === "function"
        ? prepareHeaders(headers || {}, { getState: api.getState })
        : (headers || {});

      // Inject Authorization from state
      const token = state?.auth?.accessToken;
      if (token && !hdrs.Authorization) {
        hdrs.Authorization = `Bearer ${token}`;
      }

      const result = await axiosClient.request({ url, method, data, params, headers: hdrs });
      return { data: result.data };
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        // Try refresh once
        const refreshToken = api.getState()?.auth?.refreshToken;
        if (refreshToken) {
          try {
            const refreshRes = await axiosClient.post("/v1/auth/refresh-token", { refreshToken });
            const newAccess = refreshRes?.data?.data?.access_token;
            if (newAccess) {
              api.dispatch(setAccessToken(newAccess));
              // Retry original request with fresh token
              const retryHeaders = { ...(err.config.headers || {}), Authorization: `Bearer ${newAccess}` };
              const retryRes = await axiosClient.request({ ...err.config, headers: retryHeaders });
              return { data: retryRes.data };
            }
          } catch (e) {
            // fall through to logout
          }
        }
        api.dispatch(logout());
      }
      return { error: { status: status || 500, data: err?.response?.data || { message: err.message } } };
    }
  };
};

export default axiosBaseQuery;
