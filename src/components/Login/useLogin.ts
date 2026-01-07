import { useState } from 'react';
import { post, ApiResponse } from '../api';
import { useLoginStore } from './LoginStore';

export type LoginMode = 'authorization' | 'registration' | 'restore';

export interface LoginState {
  mode: LoginMode;
  phone: string;
  password: string;
  pincode: string;
  name: string;
  email: string;
  registrationStep: 'phone' | 'code' | 'profile';
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  pincode: string;
  password: string;
  name: string;
  email: string;
}

export interface RestorePayload {
  phone: string;
  pincode: string;
  password: string;
}

interface AuthResponse {
  phone: string;
  name: string;
  email: string;
  role: string;
  pincode?: string;
  token: string;
}

export const useLogin = (initialMode: LoginMode = 'authorization') => {
  const {
    setPhone,
    setName,
    setEmail: setStoreEmail,
    setRole,
    setPincode,
    setToken,
    setMode: setStoreMode,
  } = useLoginStore();

  const [state, setState] = useState<LoginState>({
    mode: initialMode,
    phone: '',
    password: '',
    pincode: '',
    name: '',
    email: '',
    registrationStep: 'phone',
  });

  const setMode = (mode: LoginMode) =>
    setState((prev) => ({
      ...prev,
      mode,
    }));

  const setPhoneState = (phone: string) =>
    setState((prev) => ({
      ...prev,
      phone,
    }));

  const setPassword = (password: string) =>
    setState((prev) => ({
      ...prev,
      password,
    }));

  const setPincodeState = (pincode: string) =>
    setState((prev) => ({
      ...prev,
      pincode,
    }));

  const setNameState = (name: string) =>
    setState((prev) => ({
      ...prev,
      name,
    }));

  const setEmailState = (email: string) =>
    setState((prev) => ({
      ...prev,
      email,
    }));

  const setRegistrationStep = (step: LoginState['registrationStep']) =>
    setState((prev) => ({
      ...prev,
      registrationStep: step,
    }));

  const reset = () =>
    setState({
      mode: 'authorization',
      phone: '',
      password: '',
      pincode: '',
      name: '',
      email: '',
      registrationStep: 'phone',
    });

  const login = async ({ phone, password }: LoginPayload) => {
    const apiRes = await post<AuthResponse, LoginPayload>(
      '/auth/login',
      { phone, password },
    );

    if (!apiRes.success || !apiRes.data) {
      throw new Error(apiRes.message || 'Ошибка авторизации');
    }

    const response = apiRes.data;

    setPhone(response.phone);
    setName(response.name);
    setStoreEmail(response.email);
    setRole(response.role);
    setPincode(response.pincode ?? '');
    setToken(response.token);
    setStoreMode('login');

    return response;
  };

  const requestRegisterCode = async (phone: string) => {
    const apiRes = await post<null, { phone: string }>(
      '/auth/register/request-sms',
      { phone },
    );
    if (!apiRes.success) {
      throw new Error(apiRes.message || 'Не удалось отправить СМС');
    }
    setRegistrationStep('code');
    setPhoneState(phone);
    return apiRes;
  };

  const verifyRegisterCode = async ({ phone, pincode }: { phone: string; pincode: string }) => {
    const apiRes = await post<null, { phone: string; pincode: string }>(
      '/auth/register/verify-sms',
      { phone, pincode },
    );
    if (!apiRes.success) {
      throw new Error(apiRes.message || 'Неверный код из СМС');
    }
    setRegistrationStep('profile');
    setPincodeState(pincode);
    return apiRes;
  };

  const register = async ({ phone, pincode, password, name, email }: RegisterPayload) => {
    const apiRes = await post<AuthResponse, RegisterPayload>(
      '/auth/register',
      { phone, pincode, password, name, email },
    );

    if (!apiRes.success || !apiRes.data) {
      throw new Error(apiRes.message || 'Ошибка регистрации');
    }

    const response = apiRes.data;

    setPhone(response.phone);
    setName(response.name);
    setStoreEmail(response.email);
    setRole(response.role);
    setPincode(response.pincode ?? '');
    setToken(response.token);
    setStoreMode('register');
    setRegistrationStep('phone');

    return response;
  };

  const restore = async ({ phone, pincode, password }: RestorePayload) => {
    const apiRes = await post<AuthResponse, RestorePayload>(
      '/auth/restore',
      { phone, pincode, password },
    );

    if (!apiRes.success || !apiRes.data) {
      throw new Error(apiRes.message || 'Ошибка восстановления пароля');
    }

    const response = apiRes.data;

    setPhone(response.phone);
    setName(response.name);
    setStoreEmail(response.email);
    setRole(response.role);
    setPincode(response.pincode ?? '');
    setToken(response.token);
    setStoreMode('restore');

    return response;
  };

  return {
    state,
    setMode,
    setPhone: setPhoneState,
    setPassword,
    setPincode: setPincodeState,
    setName: setNameState,
    setEmail: setEmailState,
    setRegistrationStep,
    reset,
    login,
    requestRegisterCode,
    verifyRegisterCode,
    register,
    restore,
  };
};


