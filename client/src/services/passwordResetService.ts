import { api } from '../api/axios';

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    name: string;
    email: string;
  };
}

export const passwordResetService = {
  // Request password reset
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/password-reset/forgot-password', data);
    return response.data;
  },

  // Verify reset token
  verifyResetToken: async (token: string): Promise<VerifyTokenResponse> => {
    const response = await api.get(`/password-reset/verify-reset-token/${token}`);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/password-reset/reset-password', data);
    return response.data;
  }
};
