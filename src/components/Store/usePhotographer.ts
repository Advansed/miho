// usePhotographer.ts
import { useCallback } from 'react';
import { usePhotographerStore } from './photographerStore';
import { post } from '../api';
import { useToast } from '../Toast';
import { useToken } from '../Login/LoginStore';

export const usePhotographer = () => {
  const {
    photographers,
    loading,
    set_loading,
    set_photographers,
  } = usePhotographerStore();
  const { token } = useToken();
  const toast = useToast();

  const get_photographers = useCallback(
    async () => {
      try {
        set_loading(true);
        const response = await post<any>('/node/get_photographers', { token });
        
        console.log('get_photographers', response);
        
        if (response) {
          if (response.success) {
            set_photographers(response.data || []);
          } else {
            toast.error(response.message || 'Ошибка получения фотографов');
          }
        }
      } catch (e: any) {
        console.error('get_photographers: Ошибка сети ', e);
        toast.error(e?.message || 'Ошибка получения данных фотографов');
      } finally {
        set_loading(false);
      }
    },
    [token, toast, set_photographers, set_loading]
  );

  return {
    photographers,
    loading,
    set_loading,
    get_photographers,
  };
};
