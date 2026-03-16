import { create } from 'zustand';
import { useFilesStore } from '../Store/filesStore';

type LoginMode = 'register' | 'login' | 'restore';

export interface LoginStoreState {
  auth:         boolean;
  phone:        string;
  name:         string;
  email:        string;
  role:         string;
  pincode:      string;
  token:        string;
  mode:         LoginMode;
  loading:      boolean;
  setAuth:      (auth: boolean) => void;
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
  auth:         false,
  phone:        '',
  name:         '',
  email:        '',
  role:         '',
  pincode:      '',
  token:        '',
  mode:         'login',
  loading:      false,
  setAuth:      (auth) => set({ auth}),
  setPhone:     (phone) => set({ phone }),
  setName:      (name) => set({ name }),
  setEmail:     (email) => set({ email }),
  setRole:      (role) => set({ role }),
  setPincode:   (pincode) => set({ pincode }),
  setToken:     (token) => set({ token }),
  setMode:      (mode) => set({ mode }),
  setLoading:   (loading) => set({ loading }),
  reset:        () => {
    useFilesStore.getState().clearSessionFiles();
    set({
      phone:    '',
      name:     '',
      email:    '',
      role:     '',
      pincode:  '',
      token:    '',
      mode:     'login',
      loading:  false,
    });
  },
}));



export const    useToken = () => {
  const token     = useLoginStore( (state) => state.token );
  const setToken  = useLoginStore( (state) => state.setToken );
  return { token, setToken };
};

export const  useAuth = () => {
  const auth      = useLoginStore( (state) => state.auth )
  const setAuth   = useLoginStore( (state) => state.setAuth )
  return { auth, setAuth }
}


export const  useUserData = () => {
  const name        = useLoginStore( (state) => state.name )
  const phone       = useLoginStore( (state) => state.phone )
  const email       = useLoginStore( (state) => state.email )

  return { name, phone, email }
}