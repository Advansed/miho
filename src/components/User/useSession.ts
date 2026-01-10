// useSession.ts
import { useState, useCallback } from 'react';
import { useUserStore, UserSession, SessionsStats } from './UserStore';
import { post } from '../api';

export const useSession = () => {
  const { sessions, stats, nextSession, setSessionsData } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await post<any>(
          '/node/get_sessions',
          { token }
        );
        console.log('get_sessions', response)
        if(response){
            if (!response.success) {
            setError(response.message || 'Ошибка получения сессий');
            return;
            }

            if( response.data )
                setSessionsData({
                    sessions: response.data.sessions, 
                    stats: response.data.stats, 
                    nextSession: response.data.nextSession
                });
            

        }
      } catch (e: any) {
        console.error('fetchSessions error', e);
        setError(e?.message || 'Ошибка сети');
      } finally {
        setLoading(false);
      }
    },
    [setSessionsData]
  );

  return {
    sessions,
    stats,
    nextSession,
    loading,
    error,
    fetchSessions,
  };
};
