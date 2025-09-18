import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', {
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      password: payload.password,
    });
    return res.data; // expect { user, accessToken }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await api.post('/auth/login', { email: payload.email, password: payload.password });
    return res.data;
  }
);

export const refreshAccessToken = createAsyncThunk('auth/refresh', async () => {
  const res = await api.post('/auth/refresh', {});
  return res.data; // { accessToken }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<{ user: User; accessToken: string }>>) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.accessToken) state.accessToken = action.payload.accessToken;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.error?.message) || 'Signup failed';
      })

      // login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        // Token refresh will be scheduled automatically by axios interceptor
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.error?.message) || 'Login failed';
      })

      // refresh
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
      });
  },
});

export const { setCredentials, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
