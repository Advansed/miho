import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../api';
import { useToken } from '../Login/LoginStore';

const CHUNK_SIZE = 1024 * 1024; // 1 MB

export interface UploadParams {
  userId: string;
  sessionId: string;
}

export interface UseUploadOptions {
  /** Передать токен снаружи; иначе берётся из useToken() */
  token?: string;
}

export interface UseUploadResult {
  /** Загрузить файл чанками. userId и sessionId — из контекста/хранилища. */
  uploadFile: (file: File, params: UploadParams) => Promise<{ totalChunks: number }>;
  /** Прогресс 0–100 */
  progress: number;
  /** Идёт ли загрузка */
  uploading: boolean;
  /** Сообщение об ошибке (если была) */
  error: string | null;
  /** Сбросить прогресс и ошибку */
  reset: () => void;
}

/**
 * Хук для чанковой загрузки файла (connect-busboy стиль).
 * PUT /node/chunked_upload/:userId/:sessionId/:chunkIndex?filename=...
 * Чанки по порядку 0, 1, 2, …; для каждого файла своя серия с своим filename.
 * Один и тот же userId + sessionId + filename перезаписывает файл.
 */
export function useUpload(options: UseUploadOptions = {}): UseUploadResult {
  const { token: tokenFromOptions } = options;
  const { token: tokenFromStore } = useToken();
  const token = tokenFromOptions ?? tokenFromStore;

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setProgress(0);
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File, { userId, sessionId }: UploadParams): Promise<{ totalChunks: number }> => {
      if (!token) {
        const err = 'Нет токена авторизации';
        setError(err);
        throw new Error(err);
      }

      setUploading(true);
      setError(null);
      setProgress(0);

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      try {
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunkBlob = file.slice(start, end);

          const url = `${API_BASE_URL}/node/chunked_upload/${userId}/${sessionId}/${chunkIndex}?filename=${encodeURIComponent(file.name)}&totalChunks=` + totalChunks.toString();
          const res = await fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: chunkBlob,
          });

          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            const message = (errBody as { message?: string }).message ?? `Чанк ${chunkIndex} не загружен`;
            setError(message);
            throw new Error(message);
          }

          setProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
        }

        return { totalChunks };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [token]
  );

  return {
    uploadFile,
    progress,
    uploading,
    error,
    reset,
  };
}
