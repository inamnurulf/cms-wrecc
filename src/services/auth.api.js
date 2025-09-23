import { baseApi } from "./baseApi";
import { setSession, logout } from "../store/slices/auth.slice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({ url: "/v1/auth/register", method: "POST", data: body }),
    }),
    login: build.mutation({
      query: (body) => ({ url: "/v1/auth/login", method: "POST", data: body }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        const payload = data?.data;
        if (payload?.access_token && payload?.refresh_token && payload?.user) {
          dispatch(
            setSession({
              accessToken: payload.access_token,
              refreshToken: payload.refresh_token,
              user: payload.user,
            })
          );
        }
      },
    }),
    me: build.query({
      query: () => ({ url: "/v1/auth/me", method: "GET" }),
      providesTags: ["Auth"],
    }),
    logout: build.mutation({
      query: (_, { getState }) => {
        const rt = getState()?.auth?.refreshToken;
        return { url: "/v1/auth/logout", method: "POST", data: { refreshToken: rt } };
      },
      async onQueryStarted(_, { dispatch }) {
        dispatch(logout());
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
