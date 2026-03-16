import { useCallback, useEffect, useRef } from 'react';
import { API_BASE_URL, post } from '../api';
import { useToken } from '../Login/LoginStore';
import { useToast } from '../Toast';
import {
  useFilesStore,
  type SessionFileItem,
} from './filesStore';

const EMPTY_FILES: SessionFileItem[] = [];

export function useSessionFiles(sessionId: string | null) {
  const { token } = useToken();
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const files = useFilesStore((s) =>
    sessionId ? (s.filesBySessionId[sessionId] ?? EMPTY_FILES) : EMPTY_FILES
  );
  const loading = useFilesStore((s) =>
    sessionId ? (s.loadingBySessionId[sessionId] ?? false) : false
  );
  const error = useFilesStore((s) =>
    sessionId ? (s.errorBySessionId[sessionId] ?? null) : null
  );
  const setSessionFiles = useFilesStore((s) => s.setSessionFiles);
  const setSessionFileImage = useFilesStore((s) => s.setSessionFileImage);
  const setSessionLoading = useFilesStore((s) => s.setSessionLoading);
  const setSessionError = useFilesStore((s) => s.setSessionError);

  const fetchSessionFile = useCallback(
    async (sid: string, filename: string): Promise<string | null> => {
      if (!token) return null;
      const params = new URLSearchParams({
        token,
        sessionId: sid,
        filename,
      });
      const url = `${API_BASE_URL}/node/get_session_file?${params.toString()}`;
      try {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) return null;
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setSessionFileImage(sid, filename, objectUrl);
        return objectUrl;
      } catch {
        return null;
      }
    },
    [token, setSessionFileImage]
  );

  const fetchSessionFiles = useCallback(async () => {
    if (!sessionId || !token) return;
    setSessionLoading(sessionId, true);
    setSessionError(sessionId, null);
    try {
      const response = await post<SessionFileItem[]>(
        '/node/get_session_files',
        { token, sessionId }
      );
      if (response.success && response.data) {
        setSessionFiles(sessionId, response.data);
      } else {
        const msg = response.message ?? 'Ошибка получения файлов сессии';
        setSessionError(sessionId, msg);
        toastRef.current.error(msg);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки файлов';
      setSessionError(sessionId, msg);
      toastRef.current.error(msg);
    } finally {
      setSessionLoading(sessionId, false);
    }
  }, [sessionId, token, setSessionFiles, setSessionLoading, setSessionError]);

  useEffect(() => {
    if (sessionId) fetchSessionFiles();
  }, [sessionId, fetchSessionFiles]);

  return { files, loading, error, refetch: fetchSessionFiles, fetchSessionFile };
}
