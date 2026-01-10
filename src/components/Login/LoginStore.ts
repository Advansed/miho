import { create } from 'zustand';

type LoginMode = 'register' | 'login' | 'restore';

export interface LoginStoreState {
  phone:        string;
  name:         string;
  email:        string;
  role:         string;
  pincode:      string;
  token:        string;
  mode:         LoginMode;
  loading:      boolean;
  setPhone:     (phone: string) => void;
  setName:      (name: string) => void;
  setEmail:     (email: string) => void;
  setRole:      (role: string) => void;
  setPincode:   (pincode: string) => void;
  setToken:     (token: string) => void;
  setMode:      (mode: LoginMode) => void;
  setLoading:   (loading: boolean) => void;
  reset:        () => void;
}

export const useLoginStore = create<LoginStoreState>((set) => ({
  phone:        '',
  name:         '',
  email:        '',
  role:         '',
  pincode:      '',
  token:        '',
  mode:         'login',
  loading:      false,
  setPhone:     (phone) => set({ phone }),
  setName:      (name) => set({ name }),
  setEmail:     (email) => set({ email }),
  setRole:      (role) => set({ role }),
  setPincode:   (pincode) => set({ pincode }),
  setToken:     (token) => set({ token }),
  setMode:      (mode) => set({ mode }),
  setLoading:   (loading) => set({ loading }),
  reset:        () =>
    set({
      phone:    '',
      name:     '',
      email:    '',
      role:     '',
      pincode:  '',
      token:    '',
      mode:     'login',
      loading:  false,
    }),
}));



export const    useToken = () => {
  const token    = useLoginStore( (state) => state.token );
  const setToken = useLoginStore( (state) => state.setToken );
  return { token, setToken };
};