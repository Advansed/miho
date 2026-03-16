import { useState } from 'react';
import { post, ApiResponse } from '../api';
import { useAuth, useLoginStore, useToken } from './LoginStore';
import { useToast } from '../Toast';

const STORAGE_KEY_PHONE = 'login_phone';
const STORAGE_KEY_PASSWORD = 'login_password';

function getStoredPhone(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_PHONE) ?? '';
  } catch {
    return '';
  }
}

function getStoredPassword(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_PASSWORD) ?? '';
  } catch {
    return '';
  }
}

function setStoredCredentials(phone: string, password: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PHONE, phone);
    localStorage.setItem(STORAGE_KEY_PASSWORD, password);
  } catch {
    // ignore
  }
}

export type LoginMode = 'authorization' | 'registration' | 'restore';

export interface LoginState {
  mode: LoginMode;
  phone: string;
  password: string;
  confirmPassword: string;
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
  token?: string;
  phone: string;
  password: string;
  name?: string;
  email?: string;
}

export interface RestorePayload {
  phone: string;
  pincode: string;
  password: string;
}

export interface VerifyResponse {
  token: string;
}

interface AuthResponse {
  phone: string;
  name: string;
  email: string;
  role: string;
  pincode?: string;
  token: string;
}

export interface LoginState {
  mode: LoginMode;
  phone: string;
  password: string;
  confirmPassword: string;
  pincode: string;
  name: string;
  email: string;
  registrationStep: 'phone' | 'code' | 'profile';
}


export const useLogin = (initialMode: LoginMode = 'authorization') => {
  const toast = useToast();
  const {
    setPhone,
    setName,
    setEmail: setStoreEmail,
    setRole,
    setPincode,
    setMode: setStoreMode,
    loading,
    setLoading,
  } = useLoginStore();

  const { token, setToken } = useToken();

  const { auth, setAuth } = useAuth()

  // Начальное состояние: подставляем сохранённые логин и пароль
  const [state, setState] = useState<LoginState>(() => ({
    mode: initialMode,
    phone: getStoredPhone(),
    password: getStoredPassword(),
    confirmPassword: '',
    pincode: '',
    name: '',
    email: '',
    registrationStep: 'phone'
  }));

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

  const setConfirm = (confirmPassword: string) =>
    setState((prev) => ({
      ...prev,
      confirmPassword,
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
      confirmPassword: '',
      pincode: '',
      name: '',
      email: '',
      registrationStep: 'phone'
    });

  const login = async ({ phone, password }: LoginPayload) => {
    setLoading(true);
    try {
      const apiRes = await post<AuthResponse, LoginPayload>(
        '/node/login',
        { phone, password },
      );

      console.log('apiRes', apiRes )

      if (!apiRes.success || !apiRes.data) {
        const errorMsg = apiRes.message || 'Ошибка авторизации';
        toast.error(errorMsg);
        // throw new Error(errorMsg);
        return {success: false, message: errorMsg}
      } 

      const response = apiRes.data;

      setPhone(response.phone);
      setName(response.name);
      setStoreEmail(response.email);
      setRole(response.role);
      setPincode(response.pincode ?? '');
      setToken(response.token);
      setStoreMode('login');

      setAuth( true );

      setStoredCredentials(phone, password);
      toast.success('Успешная авторизация!');
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestRegisterCode = async (phone: string, restore?: boolean) => {
    setLoading(true);
    try {
      const apiRes = await post<null, { phone: string, restore?: boolean }>(
        '/node/phone',
        { phone, restore },
      );

      console.log("node/phone", apiRes)
      if (!apiRes.success) {
        const errorMsg = apiRes.message || 'Не удалось отправить СМС';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      setRegistrationStep('code');
      setPhoneState(phone);
      toast.success('Код отправлен на номер');
      return apiRes;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при отправке кода';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyRegisterCode = async ({ phone, pincode }: { phone: string; pincode: string }) => {
    setLoading(true);
    try {
      const apiRes = await post<VerifyResponse, { phone: string; pincode: string }>(
        '/node/verify',
        { phone, pincode },
      );
      if (!apiRes.success) {
        const errorMsg = apiRes.message || 'Неверный код из СМС';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      setRegistrationStep('profile');
      setPincodeState(pincode);
      if(apiRes.data){
        setToken( apiRes.data.token || '' )
      }
      toast.success('Код верифицирован!');
      return apiRes;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при проверке кода';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ phone, password, name, email }: RegisterPayload) => {
    setLoading(true);
    try {
      const apiRes = await post<AuthResponse, RegisterPayload>(
        '/node/register',
        { token, phone, password, name, email },
      );

      console.log('register', apiRes)

      if (!apiRes.success || !apiRes.data) {
        const errorMsg = apiRes.message || 'Ошибка регистрации';
        toast.error(errorMsg);
        throw new Error(errorMsg);
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

      toast.success('Регистрация успешна!');
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при регистрации';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restore = async ({ phone, pincode, password }: RestorePayload) => {
    setLoading(true);
    try {
      const apiRes = await post<AuthResponse, RestorePayload>(
        '/auth/restore',
        { phone, pincode, password },
      );

      if (!apiRes.success || !apiRes.data) {
        const errorMsg = apiRes.message || 'Ошибка восстановления пароля';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const response = apiRes.data;

      setPhone(response.phone);
      setName(response.name);
      setStoreEmail(response.email);
      setRole(response.role);
      setPincode(response.pincode ?? '');
      setToken(response.token);
      setStoreMode('restore');

      toast.success('Пароль восстановлен!');
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при восстановлении пароля';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    token,
    setMode,
    setPhone: setPhoneState,
    setPassword,
    setConfirm,
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
    loading,
  };
};