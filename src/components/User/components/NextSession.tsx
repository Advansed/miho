// NextSessionCard.tsx
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
import styles from '../Styles.module.css';
import type { Session } from '../../Store/sessionStore';
import { useUserStore } from '../../Store/sessionStore';
import { usePhotographer } from '../../Store/usePhotographer';

interface NextSessionCardProps {
  loading: boolean;
  nextSession: Session | null;
  onPaySession: (id: string) => void;
  onOpenSession: (session: Session) => void;
  onCreateOrder: () => void;
  formatDate: (dateStr: string) => string;
  getStatusLabel: (session: Session) => string;
  getStatusColor: (session: Session) => string;
}

const NextSessionCard: React.FC<NextSessionCardProps> = ({
  loading,
  nextSession,
  onPaySession,
  onOpenSession,
  onCreateOrder,
  formatDate,
  getStatusLabel,
  getStatusColor
}) => {
  const sessionTypes = useUserStore((s) => s.session_types);
  const { photographers } = usePhotographer();

  const getTypeName = (session: Session) => {
    const typeId = session.type;
    return sessionTypes.find((t) => t.id === typeId)?.name ?? typeId;
  };

  const getPhotographerName = (photographerId: string | undefined): string | null => {
    if (!photographerId) return null;
    const photographer = photographers.find((p) => p.id === photographerId);
    return photographer?.name ?? null;
  };

  if (loading) {
    return (
      <div className={styles.cardNextWrapper}>
        <div className={styles.nextSessionCard}>
          <div className={styles.nextSessionGlow} />
          <div className={styles.nextSessionHeader}>
            <h2 className={styles.nextSessionTitle}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionTitleIcon} />
              Ближайшая фотосессия
            </h2>
            <IonSkeletonText animated className={styles.nextSessionDateSkeleton} />
          </div>
          <div className={styles.nextSessionSkeletonRow}>
            <IonSkeletonText animated className={styles.nextSessionSkeletonTitle} />
            <IonSkeletonText animated className={styles.nextSessionSkeletonButton} />
          </div>
        </div>
      </div>
    );
  }

  if (!nextSession) {
    return (
      <div className={styles.cardNextWrapper}>
        <div className={styles.nextSessionCard}>
          <div className={styles.nextSessionGlow} />
          <div className={styles.nextSessionHeader}>
            <h2 className={styles.nextSessionTitle}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionTitleIcon} />
              Ближайшая фотосессия
            </h2>
            <p className={styles.nextSessionDateEmpty}>Нет предстоящих сессий</p>
          </div>
          <div className={styles.nextSessionEmpty}>
            <div className={styles.nextSessionEmptyIconBox}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionEmptyIcon} />
            </div>
            <h3 className={styles.nextSessionEmptyTitle}>Нет предстоящих фотосессий</h3>
            <p className={styles.nextSessionEmptyText}>Запланируйте свою первую съёмку</p>
            <IonButton className={styles.button} onClick={onCreateOrder}>
              <IonIcon slot="start" icon={calendarOutline} />
              Запланировать съёмку
            </IonButton>
          </div>
        </div>
      </div>
    );
  }

  const photographerName = getPhotographerName(nextSession.photographer_id);

  return (
    <div className={styles.cardNextWrapper}>
      <div className={styles.nextSessionCard}>
        <div className={styles.nextSessionGlow} />

        <div className={styles.nextSessionHeader}>
          <div>
            <h2 className={styles.nextSessionTitle}>
              <IonIcon icon={calendarOutline} className={styles.nextSessionTitleIcon} />
              Ближайшая фотосессия
            </h2>
            <p className={styles.nextSessionDate}>
              {formatDate(nextSession.date)}
              {photographerName && (
                <>
                  {' · '}
                  <IonIcon icon={personOutline} style={{ verticalAlign: 'middle', marginRight: 4, fontSize: '1em' }} />
                  {photographerName}
                </>
              )}
            </p>
          </div>
          <IonBadge color={getStatusColor(nextSession)} className={styles.nextSessionBadge}>
            {getStatusLabel(nextSession)}
          </IonBadge>
        </div>

        <div className={styles.nextSessionContent}>
          <div className={styles.nextSessionInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h3 className={styles.nextSessionType} style={{ margin: 0 }}>
                {getTypeName(nextSession)}
              </h3>
              <div className={styles.nextSessionMetaItem}>
                <IonIcon icon={cashOutline} className={styles.nextSessionMetaIcon} />
                <span className={styles.nextSessionAmount}>
                  {nextSession.amount} ₽
                </span>
              </div>
            </div>

            {nextSession.location && (
              <div className={styles.nextSessionMetaItem} style={{ marginBottom: '16px' }}>
                <IonIcon icon={locationOutline} className={styles.nextSessionMetaIcon} />
                <span className={styles.nextSessionMetaText}>{nextSession.location}</span>
              </div>
            )}

            <div className={styles.nextSessionButtons}>
              {!nextSession.isPaid && (
                <IonButton
                  className={`${styles.button} ${styles.payNowButton}`}
                  onClick={() => onPaySession(nextSession.id)}
                >
                  Оплатить сейчас
                </IonButton>
              )}
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
      </div>
    </div>
  );
};

export default NextSessionCard;
