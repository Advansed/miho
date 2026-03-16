import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonProgressBar,
  IonSpinner,
  IonModal,
} from '@ionic/react';
import {
  arrowBackOutline,
  folderOutline,
  documentOutline,
  closeOutline,
  imageOutline,
} from 'ionicons/icons';
import { useUpload } from '../../Store/useUpload';
import { useSessionFiles } from '../../Store/useSessionFiles';
import { useFilesStore } from '../../Store/filesStore';
import type { SessionFileItem } from '../../Store/filesStore';
import styles from '../../User/Styles.module.css';
import type { Session } from '../../Store/sessionStore';

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
}

type UploadRowItem = QueuedFile & { isCurrent: boolean };

interface SessionUploadProps {
  session: Session;
  onClose: () => void;
  /** userId для пути загрузки; по умолчанию session.photographer_id */
  userId?: string;
}

const SessionUpload: React.FC<SessionUploadProps> = ({ session, onClose, userId: userIdProp }) => {
  const userId = userIdProp ?? session.photographer_id;
  const { uploadFile, progress, uploading, error, reset } = useUpload();
  const { files, loading: filesLoading, fetchSessionFile } = useSessionFiles(session.id);
  const addSessionFile = useFilesStore((s) => s.addSessionFile);

  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [currentFile, setCurrentFile] = useState<QueuedFile | null>(null);
  const [previewFile, setPreviewFile] = useState<{ sessionId: string; filename: string } | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const inputFilesRef = useRef<HTMLInputElement>(null);
  const inputFolderRef = useRef<HTMLInputElement>(null);

  const processingRef = useRef(false);
  const queueAndCurrentRef = useRef({ queue: [] as QueuedFile[], current: null as QueuedFile | null });

  useEffect(() => {
    queueAndCurrentRef.current = { queue, current: currentFile };
  }, [queue, currentFile]);

  useEffect(() => {
    return () => {
      queueAndCurrentRef.current.queue.forEach((q) => {
        if (q.previewUrl) URL.revokeObjectURL(q.previewUrl);
      });
      if (queueAndCurrentRef.current.current?.previewUrl) {
        URL.revokeObjectURL(queueAndCurrentRef.current.current.previewUrl);
      }
    };
  }, []);

  // Запуск следующего из очереди, когда не грузим и очередь не пуста
  useEffect(() => {
    if (uploading || processingRef.current || queue.length === 0) return;
    const [first, ...rest] = queue;
    processingRef.current = true;
    setCurrentFile(first);
    setQueue(rest);
    uploadFile(first.file, { userId, sessionId: session.id })
      .then(() => {
        addSessionFile(session.id, {
          name: first.file.name,
          thumb: first.previewUrl || '',
        });
      })
      .catch(() => {})
      .finally(() => {
        setCurrentFile(null);
        reset();
        processingRef.current = false;
      });
  }, [uploading, queue, userId, session.id, uploadFile, reset, addSessionFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newItems: QueuedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newItems.push({
        id: `${file.name}-${Date.now()}-${i}`,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      });
    }
    setQueue((prev) => [...prev, ...newItems]);
    e.target.value = '';
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const inProgressList: UploadRowItem[] = [
    ...(currentFile ? [{ ...currentFile, isCurrent: true }] : []),
    ...queue.map((q) => ({ ...q, isCurrent: false })),
  ];

  const previewFileData = previewFile
    ? files.find((f) => f.name === previewFile.filename) ?? null
    : null;

  const handleThumbClick = useCallback(
    async (f: SessionFileItem) => {
      console.log("thumb click", f)
      setPreviewFile({ sessionId: session.id, filename: f.name });
      if (f.image) {
        // window.open(f.image, '_blank');
        return;
      }
      setLoadingImage(true);
      const imageUrl = await fetchSessionFile(session.id, f.name);
      console.log("imageUrl", imageUrl)
      setLoadingImage(false);
        // if (imageUrl) window.open(imageUrl, '_blank');
    },
    [session.id, fetchSessionFile]
  );

  return (
    <>
      <IonHeader className={styles.toolbar}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.toolbarTitle}>Файлы · #{session.id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <input
        ref={inputFilesRef}
        type="file"
        multiple
        accept="image/*,.jpg,.jpeg,.png,.heic,.heif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={inputFolderRef}
        type="file"
        multiple
        // @ts-expect-error webkitdirectory
        webkitdirectory=""
        directory=""
        accept="image/*,.jpg,.jpeg,.png,.heic,.heif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <IonContent className={styles.pageContent} scrollY>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100%',
            padding: '24px 16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 'min(900px, 92vw)',
            }}
            className={`${styles.pageCard} ${styles.pageCardCompact}`}
          >
            <div
              className={styles.formSectionCompact}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: 0,
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(148,163,184,0.2)',
              }}
            >
              <h4 className={styles.sectionTitleCompact} style={{ margin: 0 }}>
                Файлы · #{session.id}
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <IonButton
                  fill="solid"
                  size="small"
                  onClick={() => inputFilesRef.current?.click()}
                  disabled={uploading}
                >
                  <IonIcon slot="start" icon={documentOutline} />
                  Выбрать файлы
                </IonButton>
                <IonButton
                  fill="outline"
                  size="small"
                  onClick={() => inputFolderRef.current?.click()}
                  disabled={uploading}
                >
                  <IonIcon slot="start" icon={folderOutline} />
                  Папка
                </IonButton>
              </div>
            </div>
            {inProgressList.length > 0 && (
              <div className={styles.formSectionCompact}>
                <h4 className={styles.sectionTitleCompact}>Загрузка</h4>
                {error && (
                  <p style={{ fontSize: '12px', color: 'var(--ion-color-danger)', marginBottom: 8 }}>
                    {error}
                  </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {inProgressList.map((u) => (
                    <li
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(148,163,184,0.2)',
                      }}
                    >
                      <span style={{ flex: 1, fontSize: '14px', color: '#e5e7eb' }} title={u.file.name}>
                        {u.file.name.length > 30 ? u.file.name.slice(0, 27) + '…' : u.file.name}
                      </span>
                      <span style={{ width: 72, fontSize: '12px', color: '#94a3b8' }}>
                        {u.isCurrent && uploading && (
                          <>
                            <IonSpinner name="crescent" style={{ width: 14, height: 14, marginRight: 4 }} />
                            {Math.round(progress)}%
                          </>
                        )}
                        {u.isCurrent && !uploading && 'Готово'}
                        {!u.isCurrent && 'Ожидание'}
                      </span>
                      <IonProgressBar
                        value={
                          u.isCurrent && uploading
                            ? progress / 100
                            : u.isCurrent && !uploading
                              ? 1
                              : 0
                        }
                        color={u.isCurrent && !uploading ? 'success' : 'primary'}
                        style={{ width: 80, height: 6 }}
                      />
                      <IonButton
                        fill="clear"
                        size="small"
                        onClick={() => removeFromQueue(u.id)}
                        disabled={u.isCurrent && uploading}
                      >
                        <IonIcon icon={closeOutline} />
                      </IonButton>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(files.length > 0 || filesLoading) && (
              <div className={styles.formSectionCompact}>
                <h4 className={styles.sectionTitleCompact}>Загруженные фото</h4>
                {filesLoading && files.length === 0 && (
                  <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: 12 }}>
                    Загрузка списка…
                  </p>
                )}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {files.map((f, i) => (
                    <button
                      key={`${f.name}-${i}`}
                      type="button"
                      onClick={() => handleThumbClick(f)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        padding: 0,
                        border: '1px solid rgba(148,163,184,0.25)',
                        background: 'rgba(15,23,42,0.8)',
                        cursor: 'pointer',
                      }}
                    >
                      {f.thumb ? (
                        <img
                          src={f.thumb}
                          alt={f.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <IonIcon
                          icon={imageOutline}
                          style={{ fontSize: 32, color: '#94a3b8', padding: '28%' }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      <IonModal
        isOpen={!!previewFile}
        onDidDismiss={() => setPreviewFile(null)}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{previewFileData?.name ?? previewFile?.filename}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setPreviewFile(null)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          {loadingImage && !previewFileData?.image ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <IonSpinner name="crescent" />
            </div>
          ) : previewFileData?.image || previewFileData?.thumb ? (
            <img
              src={previewFileData.image || previewFileData.thumb}
              alt={previewFileData.name}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          ) : null}
        </IonContent>
      </IonModal>
    </>
  );
};

export default SessionUpload;
