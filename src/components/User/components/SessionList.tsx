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
import styles from '../Styles.module.css';
import type { Session, SessionType } from '../../Store/sessionStore';
import { useUserStore } from '../../Store/sessionStore';

export interface ClientSessionsListProps {
  loading: boolean;
  onRefresh: () => void;
  onOpenSession: (session:Session) => void;
  onPaySession: (id: string) => void;
  onCreateOrder: () => void;
  formatShortDate: (dateStr: string) => string;
  getStatusLabel: (session: Session) => string;
  getStatusColor: (session: Session) => string;
}

const ClientSessionsList: React.FC<ClientSessionsListProps> = ({
  loading,
  onRefresh,
  onOpenSession,
  onPaySession,
  onCreateOrder,
  formatShortDate,
  getStatusLabel,
  getStatusColor
}) => {
  const sessions = useUserStore((s) => s.sessions);
  const session_types = useUserStore((s) => s.session_types);

  const getSessionTypeName = (session: Session): string => {
    const t = session.type;
    return session_types.find((st) => st.id === t)?.name ?? ''
  };

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
                  onClick={() => onOpenSession( session )}
                >
                  <div className={styles.sessionItemInner}>
                    <div
                      className={[
                        styles.sessionAvatar,
                        session.status === 'completed'
                          ? styles.sessionAvatarFinished
                          : session.status === 'planned'
                          ? styles.sessionAvatarPlanned
                          : styles.sessionAvatarPending
                      ].join(' ')}
                    >
                      <IonIcon
                        icon={cameraOutline}
                        className={
                          session.status === 'completed'
                            ? styles.sessionAvatarIconFinished
                            : session.status === 'planned'
                            ? styles.sessionAvatarIconPlanned
                            : styles.sessionAvatarIconPending
                        }
                      />
                    </div>

                    <div className={styles.sessionInfo}>
                      <h3 className={styles.sessionTitle}>{getSessionTypeName(session)}</h3>
                      <div className={styles.sessionMetaRow}>
                        <span className={styles.sessionMetaItem}>
                          <IonIcon
                            icon={calendarOutline}
                            className={styles.sessionMetaIcon}
                          />
                          { session.date + ':' + session.time }
                        </span>
                        {session.location && (
                          <span className={styles.sessionMetaItem}>
                            <IonIcon
                              icon={locationOutline}
                              className={styles.sessionMetaIcon}
                            />
                            {session.location }
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
                      {!session.isPaid && session.status !== 'completed' && (
                        <IonButton
                          size="small"
                          fill="clear"
                          className={styles.sessionPayButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log( "pay" )
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
