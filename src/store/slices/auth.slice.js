import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, removeItem } from "../../utils/storage";

const initialState = {
  accessToken: getItem("accessToken"),
  refreshToken: getItem("refreshToken"),
  user: (() => {
    const raw = getItem("user");
    return raw ? JSON.parse(raw) : null;
  })(),
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      const { accessToken, refreshToken, user } = action.payload || {};
      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      state.user = user || null;
      setItem("accessToken", state.accessToken);
      setItem("refreshToken", state.refreshToken);
      setItem("user", JSON.stringify(state.user));
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload || null;
      setItem("accessToken", state.accessToken);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      removeItem("accessToken");
      removeItem("refreshToken");
      removeItem("user");
    },
  },
});

export const { setSession, setAccessToken, logout } = slice.actions;
export default slice.reducer;
