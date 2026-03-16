import { useEffect } from 'react';
import { useAuth, useToken, useLoginStore } from './components/Login/LoginStore';
import { useSession } from './components/User/useSession';
import { usePhotographer } from './components/Store/usePhotographer';


/**
 * Хук приложения: при авторизации загружает начальные данные
 * (сессии/заявки, типы сессий и т.д.) в зависимости от роли.
 */
export const useApp = () => {
  const { auth } = useAuth();
  const { token } = useToken();
  const role = useLoginStore((s) => s.role);
  const { get_datas, get_types } = useSession();
  const { get_photographers } = usePhotographer();
  
  useEffect(() => {
    if (!auth || !token) return;

    const loadInitialData = async () => {
      if (role === 'operator') {
        await Promise.all([
          get_datas(),
          get_types(),
          get_photographers(),
       ]);
      } else if (role === 'photographer') {
        await Promise.all([
          get_datas(),
          get_types(),
        ]);
      } else {
        await Promise.all([
           get_datas(),
           get_types(),
           get_photographers(),
        ]);
      }
    };

    loadInitialData();
  }, []);
};
