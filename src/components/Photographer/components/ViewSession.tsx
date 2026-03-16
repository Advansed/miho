import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  cashOutline,
  personOutline,
  mailOutline,
  callOutline,
  playOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import styles from '../../User/Styles.module.css';
import type { Session } from '../../Store/sessionStore';
import { useUserStore } from '../../Store/sessionStore';
import { useSession } from '../../User/useSession';

interface ViewSessionProps {
  session: Session;
  onClose: () => void;
  onStartSession?: () => void;
}

const ViewSession: React.FC<ViewSessionProps> = ({
  session,
  onClose,
  onStartSession,
}) => {
  const sessionTypes = useUserStore((s) => s.session_types);
  const { upd_session, loading, set_session } = useSession();
  const [startLoading, setStartLoading] = useState(false);

  const getTypeName = (session: Session) => {
    const typeId = session.type;
    return sessionTypes.find((t) => t.id === typeId)?.name ?? typeId;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    return timeStr.split(/[-:]/).slice(0, 2).join(':');
  };

  const handleStartSession = async () => {
    if (session.status === 'in_progress') {
      onStartSession?.();
      return;
    }
    setStartLoading(true);
    try {
      await upd_session({ id: session.id, status: 'in_progress' });
      set_session({ ...session, status: 'in_progress' });
      onStartSession?.();
    } catch (error) {
      console.error('Ошибка начала сессии:', error);
    } finally {
      setStartLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className={styles.toolbar}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.toolbarTitle}>
            Сессия #{session.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.pageContent} scrollY>
        <div className={styles.pageContainer}>
          <div className={`${styles.pageCard} ${styles.pageCardCompact}`}>
            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={cameraOutline} className={styles.sectionIcon} />
                Информация о сессии
              </h4>

              <IonItem className={styles.formItemCompact} lines="full">
                <IonIcon slot="start" icon={cameraOutline} color="primary" />
                <IonLabel>
                  <h3>{getTypeName(session)}</h3>
                </IonLabel>
              </IonItem>

              <IonItem className={styles.formItemCompact} lines="full">
                <IonIcon slot="start" icon={calendarOutline} color="primary" />
                <IonLabel>
                  <h3>{formatDate(session.date)}</h3>
                  {session.time && <p>{formatTime(session.time)}</p>}
                </IonLabel>
              </IonItem>

              {session.location && (
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonIcon slot="start" icon={locationOutline} color="primary" />
                  <IonLabel>{session.location}</IonLabel>
                </IonItem>
              )}

              <IonItem className={styles.formItemCompact} lines="full">
                <IonIcon slot="start" icon={cashOutline} color="primary" />
                <IonLabel>
                  {session.amount?.toLocaleString?.() ?? 0} ₽
                  {session.isPaid && ' • Оплачено'}
                </IonLabel>
              </IonItem>
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={personOutline} className={styles.sectionIcon} />
                Информация о клиенте
              </h4>

              {session.name && (
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonIcon slot="start" icon={personOutline} color="primary" />
                  <IonLabel>{session.name}</IonLabel>
                </IonItem>
              )}

              {session.email && (
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonIcon slot="start" icon={mailOutline} color="primary" />
                  <IonLabel>{session.email}</IonLabel>
                </IonItem>
              )}

              {session.phone && (
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonIcon slot="start" icon={callOutline} color="primary" />
                  <IonLabel>{session.phone}</IonLabel>
                </IonItem>
              )}
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>Действия</h4>
              <IonButton
                expand="block"
                className={styles.editSessionButton}
                onClick={handleStartSession}
                disabled={loading || startLoading}
              >
                {startLoading ? (
                  <IonSpinner name="crescent" />
                ) : session.status === 'in_progress' ? (
                  <>
                    <IonIcon slot="start" icon={cloudUploadOutline} />
                    Файлы
                  </>
                ) : (
                  <>
                    <IonIcon slot="start" icon={playOutline} />
                    Начать сессию
                  </>
                )}
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewSession;
