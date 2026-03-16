import { create } from 'zustand';

export interface SessionFileItem {
  name: string;
  thumb: string;
  /** Полноразмерное изображение (URL или data URL), подгружается по требованию через get_session_file */
  image?: string | null;
}

interface FilesStoreState {
  filesBySessionId:   Record<string, SessionFileItem[]>;
  loadingBySessionId: Record<string, boolean>;
  errorBySessionId:   Record<string, string | null>;

  setSessionFiles:      (sessionId: string, files: SessionFileItem[]) => void;
  addSessionFile:      (sessionId: string, file: SessionFileItem) => void;
  setSessionFileImage:  (sessionId: string, filename: string, image: string) => void;
  setSessionLoading:    (sessionId: string, loading: boolean) => void;
  setSessionError:      (sessionId: string, error: string | null) => void;
  clearSessionFiles:    (sessionId?: string) => void;
}

export const useFilesStore = create<FilesStoreState>((set) => ({
  filesBySessionId:   {},
  loadingBySessionId: {},
  errorBySessionId:   {},

  setSessionFiles:    (sessionId, files) =>
    set((state) => ({
      filesBySessionId: { ...state.filesBySessionId, [sessionId]: files },
      errorBySessionId: { ...state.errorBySessionId, [sessionId]: null },
    })),

  addSessionFile:     (sessionId, file) =>
    set((state) => {
      const list = state.filesBySessionId[sessionId] ?? [];
      return {
        filesBySessionId: { ...state.filesBySessionId, [sessionId]: [...list, file] },
      };
    }),

  setSessionFileImage: (sessionId, filename, image) =>
    set((state) => {
      const list = state.filesBySessionId[sessionId] ?? [];
      const next = list.map((f) =>
        f.name === filename ? { ...f, image } : f
      );
      return {
        filesBySessionId: { ...state.filesBySessionId, [sessionId]: next },
      };
    }),

  setSessionLoading:  (sessionId, loading) =>
    set((state) => ({
      loadingBySessionId: { ...state.loadingBySessionId, [sessionId]: loading },
    })),

  setSessionError:    (sessionId, error) =>
    set((state) => ({
      errorBySessionId: { ...state.errorBySessionId, [sessionId]: error },
    })),

  clearSessionFiles:  (sessionId) =>
    set((state) => {
      if (sessionId === undefined) {
        return {
          filesBySessionId: {},
          loadingBySessionId: {},
          errorBySessionId: {},
        };
      }
      const { [sessionId]: _, ...restFiles } = state.filesBySessionId;
      const { [sessionId]: __, ...restLoading } = state.loadingBySessionId;
      const { [sessionId]: ___, ...restError } = state.errorBySessionId;
      return {
        filesBySessionId: restFiles,
        loadingBySessionId: restLoading,
        errorBySessionId: restError,
      };
    }),

}));
