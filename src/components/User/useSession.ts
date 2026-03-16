// useSession.ts
import { useState, useCallback } from 'react';
import { Session, useUserStore } from '../Store/sessionStore';
import { post } from '../api';
import { useToast } from '../Toast';
import { useToken } from '../Login/LoginStore';

export const useSession = () => {
  const {
    session,
    sessions,
    stats,
    nextSession,
    loading,
    set_loading,
    set_session,
    set_sessions,
    set_types,
    set_nextSession,
    set_stats,
  } = useUserStore();
  const { token } = useToken()
  const toast = useToast()

  const get_sessions      = useCallback(
    async () => {
      try {

        const response = await post<any>('/node/get_sessions', { token });
        
        console.log('get_sessions', response)
        
        if(response){
            if (response.success) {
              set_sessions( response.data )
              
            } else toast.error(response.message || 'Ошибка получения сессий');

        }
      } catch (e: any) {
        console.error('get_sessions: Ошибка сети ', e);
        toast.error(e?.message || 'Ошибка получения данных сессий');
      }
    }, [token, toast, set_sessions]
  );

  const get_stats         = useCallback(
    async () => {
      try {

        const response = await post<any>('/node/get_stats', { token });
        
        console.log('get_stats', response)
        
        if(response){
            if (response.success) {
              set_stats( response.data )
              
            } else toast.error(response.message || 'Ошибка получения статистики');

        }
      } catch (e: any) {
        console.error('fetchSessions error', e);
        toast.error(e?.message || 'Ошибка получения статистики');
      }
    }, [token, toast, set_stats]
  );

  const get_nextSession   = useCallback(
    async () => {
      try {
        
        const response = await post<any>('/node/get_next_session', { token });
        
        console.log('get_nextSession', response)
        
        if(response){
            if (response.success) {
              set_nextSession( response.data )
              
            } else toast.error(response.message || 'Ошибка получения следующей сессии');

        }
      } catch (e: any) {
        console.error('fetchSessions error', e);
        toast.error(e?.message || 'Ошибка получения следующей сессии');
      } 
    }, [token, toast, set_nextSession]
  );

  const get_datas         = useCallback(
    async () => {
      try {
        set_loading( true )
          await get_sessions()
          await get_stats()
          await get_nextSession()
      } catch(e: any){
        toast.error(e.message || "Ощибка получения данных")
      } finally {
        set_loading( false )  
      }
    }
    ,[ get_sessions, get_stats, get_nextSession, set_loading]
  )

  const get_types         = useCallback(
    async () => {
      try {
        set_loading( true )
        const response = await post<any>(
          '/node/get_session_types',
          { token }
        );
        console.log('get_session_types', response)
        if (response.success && response.data) {
          set_types( response.data );
        }
      } catch (e: any) {
        console.error('fetchSessionTypes error', e);
        toast.error('Ошибка получения типов')
      } finally {
        set_loading( false)
      }
    },
    [token, set_types, set_loading ]
  );

  const del_session       = useCallback(
    async (sessionId: string) => {
      try {
        set_loading(true);

        const response = await post<any>(
          '/node/del_session',
          { token, sessionId }
        );
        if (response?.success ) {
          await get_datas()
        } else toast.error("Не удалось удалить сессию код ошибка 196")

      } catch (e: any) {
        console.error('cancel_session error', e);
        toast.error( e?.message || 'Ошибка удаления сессии код ошибки 202' );
      } finally {
        set_loading(false);
      }
    },
    [ token, toast, get_datas, set_loading ]
  );

  const upd_session       = useCallback(
    async ( sessionData: Partial<Session> ) => {
      try {
        set_loading(true);

        console.log("save", sessionData)
        const response = await post<any>(
          '/node/set_session',
          { token, ...sessionData }
        );
        console.log('set_session', response);

        if (response) {
          if (response.success) {
              await get_datas()
            
          } else toast.error(response.message || 'Ошибка сохранения сессии');
        }
      } catch (e: any) {
        console.error('set_session error', e);
        toast.error(e?.message || 'Ошибка обновления данных код ошибки 200');
      } finally {
        set_loading(false);
      }
    },
    [ token, toast, get_datas, set_loading ]
  );


  return {
    session,
    sessions,
    stats,
    nextSession,
    loading,
    set_loading,
    set_session,
    get_datas,
    get_types,
    upd_session,
    del_session
  };
};
