// src/ClientDashboard/ClientSessionsList.tsx
import React from 'react';
import {
  IonList,
  IonItem,
  IonBadge,
  IonButton,
  IonIcon,
  IonSkeletonText
} from '@ionic/react';
import {
  cameraOutline,
  calendarOutline,
  locationOutline,
  cashOutline
} from 'ionicons/icons';
import styles from './Styles.module.css';

export type SessionStatus = 'planned' | 'pending_payment' | 'finished';

export interface UserSession {
  id: number;
  date: string;
  type: string;
  locationHint?: string;
  status: SessionStatus;
  isPaid: boolean;
  amount: number;
}

export interface ClientSessionsListProps {
  loading: boolean;
  sessions: UserSession[];
  onRefresh: () => void;
  onOpenSession: (id: number) => void;
  onPaySession: (id: number) => void;
  onCreateOrder: () => void;
  formatShortDate: (dateStr: string) => string;
  getStatusLabel: (session: UserSession) => string;
  getStatusColor: (session: UserSession) => string;
}

const ClientSessionsList: React.FC<ClientSessionsListProps> = ({
  loading,
  sessions,
  onRefresh,
  onOpenSession,
  onPaySession,
  onCreateOrder,
  formatShortDate,
  getStatusLabel,
  getStatusColor
}) => {
  return (
    <div className={styles.sessionsCardWrapper}>
      <div className={styles.sessionsCard}>
        <div className={styles.sessionsHeader}>
          <div>
            <h2 className={styles.sessionsTitle}>
              <IonIcon icon={cameraOutline} className={styles.sessionsTitleIcon} />
              Все фотосессии
            </h2>
            <p className={styles.sessionsSubtitle}>
              {sessions.length} записей
            </p>
          </div>

          <IonButton
            fill="clear"
            className={styles.refreshButton}
            onClick={onRefresh}
          >
            <IonIcon slot="icon-only" icon={calendarOutline} />
          </IonButton>
        </div>

        <div className={styles.sessionsListWrapper}>
          <IonList className={styles.list}>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <IonItem key={i} className={styles.sessionItem} lines="none">
                  <div className={styles.sessionItemInner}>
                    <IonSkeletonText animated className={styles.sessionAvatarSkeleton} />
                    <div className={styles.sessionInfoSkeleton}>
                      <IonSkeletonText animated className={styles.sessionTitleSkeleton} />
                      <div className={styles.sessionMetaSkeletonRow}>
                        <IonSkeletonText animated className={styles.sessionMetaSkeleton} />
                        <IonSkeletonText animated className={styles.sessionMetaSkeleton} />
                      </div>
                    </div>
                    <IonSkeletonText animated className={styles.sessionBadgeSkeleton} />
                  </div>
                </IonItem>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <IonItem
                  key={session.id}
                  button
                  className={styles.sessionItem}
                  lines="none"
                  onClick={() => onOpenSession(session.id)}
                >
                  <div className={styles.sessionItemInner}>
                    <div
                      className={[
                        styles.sessionAvatar,
                        session.status === 'finished'
                          ? styles.sessionAvatarFinished
                          : session.status === 'planned'
                          ? styles.sessionAvatarPlanned
                          : styles.sessionAvatarPending
                      ].join(' ')}
                    >
                      <IonIcon
                        icon={cameraOutline}
                        className={
                          session.status === 'finished'
                            ? styles.sessionAvatarIconFinished
                            : session.status === 'planned'
                            ? styles.sessionAvatarIconPlanned
                            : styles.sessionAvatarIconPending
                        }
                      />
                    </div>

                    <div className={styles.sessionInfo}>
                      <h3 className={styles.sessionTitle}>{session.type}</h3>
                      <div className={styles.sessionMetaRow}>
                        <span className={styles.sessionMetaItem}>
                          <IonIcon
                            icon={calendarOutline}
                            className={styles.sessionMetaIcon}
                          />
                          {formatShortDate(session.date)}
                        </span>
                        {session.locationHint && (
                          <span className={styles.sessionMetaItem}>
                            <IonIcon
                              icon={locationOutline}
                              className={styles.sessionMetaIcon}
                            />
                            {session.locationHint}
                          </span>
                        )}
                        <span className={styles.sessionAmountItem}>
                          <IonIcon
                            icon={cashOutline}
                            className={styles.sessionAmountIcon}
                          />
                          {session.amount.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>

                    <div className={styles.sessionRight}>
                      <IonBadge
                        color={getStatusColor(session)}
                        className={styles.sessionBadge}
                      >
                        {getStatusLabel(session)}
                      </IonBadge>
                      {!session.isPaid && session.status !== 'finished' && (
                        <IonButton
                          size="small"
                          fill="clear"
                          className={styles.sessionPayButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPaySession(session.id);
                          }}
                        >
                          Оплатить
                        </IonButton>
                      )}
                    </div>
                  </div>
                </IonItem>
              ))
            ) : (
              <div className={styles.sessionsEmpty}>
                <div className={styles.sessionsEmptyIconBox}>
                  <IonIcon icon={cameraOutline} className={styles.sessionsEmptyIcon} />
                </div>
                <h3 className={styles.sessionsEmptyTitle}>Нет фотосессий</h3>
                <p className={styles.sessionsEmptyText}>
                  Создайте свою первую фотосессию
                </p>
                <IonButton className={styles.button} onClick={onCreateOrder}>
                  Начать съёмку
                </IonButton>
              </div>
            )}
          </IonList>
        </div>
      </div>
    </div>
  );
};

export default ClientSessionsList;
