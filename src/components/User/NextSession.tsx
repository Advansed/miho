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
  locationOutline
} from 'ionicons/icons';
import styles from './Styles.module.css';

type SessionStatus = 'planned' | 'pending_payment' | 'finished';

export interface UserSession {
  id: number;
  date: string;
  type: string;
  locationHint?: string;
  status: SessionStatus;
  isPaid: boolean;
  amount: number;
}

interface NextSessionCardProps {
  loading: boolean;
  nextSession: UserSession | null;
  onPaySession: (id: number) => void;
  onOpenSession: (id: number) => void;
  onCreateOrder: () => void;
  formatDate: (dateStr: string) => string;
  getStatusLabel: (session: UserSession) => string;
  getStatusColor: (session: UserSession) => string;
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
            {loading ? (
              <IonSkeletonText animated className={styles.nextSessionDateSkeleton} />
            ) : nextSession ? (
              <p className={styles.nextSessionDate}>
                {formatDate(nextSession.date)}
              </p>
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
              <h3 className={styles.nextSessionType}>{nextSession.type}</h3>
              <div className={styles.nextSessionMetaRow}>
                {nextSession.locationHint && (
                  <div className={styles.nextSessionMetaItem}>
                    <IonIcon icon={locationOutline} className={styles.nextSessionMetaIcon} />
                    <span className={styles.nextSessionMetaText}>
                      {nextSession.locationHint}
                    </span>
                  </div>
                )}
                <div className={styles.nextSessionMetaItem}>
                  <IonIcon icon={cashOutline} className={styles.nextSessionMetaIcon} />
                  <span className={styles.nextSessionAmount}>
                    {nextSession.amount.toLocaleString()} ₽
                  </span>
                </div>
              </div>

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
                  onClick={() => onOpenSession(nextSession.id)}
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
              Нет предстоящих фотосессий
            </h3>
            <p className={styles.nextSessionEmptyText}>
              Запланируйте свою первую съёмку
            </p>
            <IonButton className={styles.button} onClick={onCreateOrder}>
              <IonIcon slot="start" icon={calendarOutline} />
              Запланировать съёмку
            </IonButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextSessionCard;
