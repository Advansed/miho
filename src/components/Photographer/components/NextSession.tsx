import React from 'react';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonSkeletonText
} from '@ionic/react';
import {
  calendarOutline,
  cameraOutline,
  cashOutline,
  locationOutline,
  personOutline
} from 'ionicons/icons';
import styles from '../../User/Styles.module.css';
import type { Session } from '../../Store/sessionStore';
import { useUserStore } from '../../Store/sessionStore';

interface NextSessionCardProps {
  loading: boolean;
  nextSession: Session | null;
  onOpenSession: (session: Session) => void;
  formatDate: (dateStr: string, timeStr?: string) => string;
  getStatusLabel: (session: Session) => string;
  getStatusColor: (session: Session) => string;
}

const NextSessionCard: React.FC<NextSessionCardProps> = ({
  loading,
  nextSession,
  onOpenSession,
  formatDate,
  getStatusLabel,
  getStatusColor
}) => {
  const sessionTypes = useUserStore((s) => s.session_types);

  const getTypeName = (session: Session) => {
    const typeId = session.type;
    return sessionTypes.find((t) => t.id === typeId)?.name ?? typeId;
  };

  const getClientName = (session: Session): string => {
    return session.name || session.email || session.phone || 'Клиент';
  };

  const formatTime = (timeStr: string): string => {
    // Форматируем время из формата HH-mm-ss или HH:mm:ss в HH:mm
    if (!timeStr) return '';
    return timeStr.split(/[-:]/).slice(0, 2).join(':');
  };

  const handleCardClick = () => {
    if (nextSession && !loading) {
      onOpenSession(nextSession);
    }
  };

  return (
    <div className={styles.cardNextWrapper}>
      <div 
        className={styles.nextSessionCard}
        onClick={handleCardClick}
        style={{ cursor: nextSession && !loading ? 'pointer' : 'default' }}
      >
        <div className={styles.nextSessionGlow} />

        <div className={styles.nextSessionHeader}>
          <div>
            <h2 className={styles.nextSessionTitle}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionTitleIcon} />
              Ближайшая сессия
            </h2>
            {loading ? (
              <IonSkeletonText animated className={styles.nextSessionDateSkeleton} />
            ) : nextSession ? (
              <div className={styles.nextSessionDateTime}>
                <p className={styles.nextSessionDate}>
                  {formatDate(nextSession.date, nextSession.time)}
                </p>
              </div>
            ) : (
              <p className={styles.nextSessionDateEmpty}>
                Нет предстоящих сессий
              </p>
            )}
          </div>

          {nextSession && (
            <IonBadge color={getStatusColor(nextSession)} className={styles.nextSessionBadge}>
              {getStatusLabel(nextSession)}
            </IonBadge>
          )}
        </div>

        {loading ? (
          <div className={styles.nextSessionSkeletonRow}>
            <IonSkeletonText animated className={styles.nextSessionSkeletonTitle} />
            <IonSkeletonText animated className={styles.nextSessionSkeletonButton} />
          </div>
        ) : nextSession ? (
          <div className={styles.nextSessionContent}>
            <div className={styles.nextSessionInfo}>
              <h3 className={styles.nextSessionType}>{getTypeName(nextSession)}</h3>
              <div className={styles.nextSessionMetaRow}>
                <div className={styles.nextSessionMetaItem}>
                  <IonIcon icon={personOutline} className={styles.nextSessionMetaIcon} />
                  <span className={styles.nextSessionMetaText}>
                    {getClientName(nextSession)}
                  </span>
                </div>
                {nextSession.location && (
                  <div className={styles.nextSessionMetaItem}>
                    <IonIcon icon={locationOutline} className={styles.nextSessionMetaIcon} />
                    <span className={styles.nextSessionMetaText}>
                      {nextSession.location}
                    </span>
                  </div>
                )}
                <div className={styles.nextSessionMetaItem}>
                  <IonIcon icon={cashOutline} className={styles.nextSessionMetaIcon} />
                  <span className={styles.nextSessionAmount}>
                    {nextSession.amount?.toLocaleString?.() ?? 0} ₽
                  </span>
                </div>
              </div>

              <div className={styles.nextSessionButtons} onClick={(e) => e.stopPropagation()}>
                <IonButton
                  fill="outline"
                  className={styles.moreButton}
                  onClick={() => onOpenSession(nextSession)}
                >
                  Подробнее
                </IonButton>
              </div>
            </div>

            <div className={styles.nextSessionIconBox}>
              <IonIcon icon={cameraOutline} className={styles.nextSessionIcon} />
            </div>
          </div>
        ) : (
          <div className={styles.nextSessionEmpty}>
            <div className={styles.nextSessionEmptyIconBox}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionEmptyIcon} />
            </div>
            <h3 className={styles.nextSessionEmptyTitle}>
              Нет предстоящих сессий
            </h3>
            <p className={styles.nextSessionEmptyText}>
              У вас пока нет запланированных фотосессий
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextSessionCard;
