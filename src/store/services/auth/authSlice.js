import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const initialState = {
  accessToken: '',
  refreshToken: '',
  user: null,
  tokenExpiry: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;

      const decodedToken = jwtDecode(action.payload.accessToken);
      state.tokenExpiry = decodedToken.exp * 1000;

      state.loading = false;
    },

    userLoggedOut: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.user = null;
      state.tokenExpiry = null;
      state.loading = false;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },

    userLoginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    loadUser: (state) => {
      state.loading = true;
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (accessToken && refreshToken) {
        const decodedToken = jwtDecode(accessToken);
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = decodedToken.user;
        state.tokenExpiry = decodedToken.exp * 1000;
        state.loading = false;
      } else {
        state.accessToken = '';
        state.refreshToken = '';
        state.user = null;
        state.tokenExpiry = null;
      }
      state.loading = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut, userLoginFailed, loadUser, userLoading } =
  authSlice.actions;

export default authSlice.reducer;
