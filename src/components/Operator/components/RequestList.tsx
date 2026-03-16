import React from 'react';
import {
  IonList,
  IonItem,
  IonBadge,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import {
  cameraOutline,
  calendarOutline,
  locationOutline,
  cashOutline,
  personOutline,
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import { Session, useUserStore } from '../../Store/sessionStore';
import { usePhotographer } from '../../Store/usePhotographer';

const getStatusLabel = (s: Session) => {
  if (s.status === 'draft') return 'Черновик';
  if (s.status === 'planned') return 'Назначена';
  if (s.status === 'in_progress') return 'Идёт съёмка';
  if (s.status === 'completed' && !s.isPaid) return 'Ждёт оплаты';
  if (s.status === 'completed' && s.isPaid) return 'Завершена';
  return 'В обработке';
};

const getStatusColor = (s: Session): 'light' | 'primary' | 'secondary' | 'warning' | 'success' | 'medium' => {
  if (s.status === 'draft') return 'light';
  if (s.status === 'planned') return 'primary';
  if (s.status === 'in_progress') return 'secondary';
  if (s.status === 'completed' && !s.isPaid) return 'warning';
  if (s.status === 'completed' && s.isPaid) return 'success';
  return 'medium';
};

export interface RequestListProps {
  /** Список сессий для отображения */
  requests: Session[];
  /** Заголовок блока списка */
  listTitle?: string;
  loading: boolean;
  onRefresh: () => void;
  onOpenRequest: (request: Session) => void;
  formatShortDate: (dateStr: string) => string;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  listTitle: listTitleProp,
  loading,
  onRefresh,
  onOpenRequest,
  formatShortDate,
}) => {
  const listTitle = listTitleProp ?? 'Заявки (не завершены)';
  const sessionTypes = useUserStore((s) => s.session_types);
  const { photographers } = usePhotographer();

  const getTypeName = (r: Session) => {
    const typeId = r.type;
    return sessionTypes.find((t) => t.id === typeId)?.name ?? typeId;
  };

  const getPhotographerName = (photographerId: string | undefined): string | null => {
    if (!photographerId) return null;
    const photographer = photographers.find((p) => p.id === photographerId);
    return photographer?.name ?? null;
  };

  return (
    <div className={styles.sessionsCardWrapper}>
      <div className={styles.sessionsCard}>
        <div className={styles.sessionsHeader}>
          <div>
            <h2 className={styles.sessionsTitle}>
              <IonIcon icon={cameraOutline} className={styles.sessionsTitleIcon} />
              {listTitle}
            </h2>
            <p className={styles.sessionsSubtitle}>
              {requests.length} заявок
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
                  <div className={styles.sessionItemSkeletonInner}>
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
            ) : requests.length > 0 ? (
              requests.map((request) => (
                <IonItem
                  key={request.id}
                  button
                  className={styles.sessionItem}
                  lines="none"
                  onClick={() => onOpenRequest(request)}
                >
                  <div className={styles.sessionItemInner}>
                    <div
                      className={[
                        styles.sessionAvatar,
                        request.status === 'planned'
                          ? styles.sessionAvatarPlanned
                          : styles.sessionAvatarPending,
                      ].join(' ')}
                    >
                      <IonIcon
                        icon={cameraOutline}
                        className={
                          request.status === 'planned'
                            ? styles.sessionAvatarIconPlanned
                            : styles.sessionAvatarIconPending
                        }
                      />
                    </div>
                    <div className={styles.sessionInfo}>
                      <h3 className={styles.sessionTitle}>{getTypeName(request)}</h3>
                      <div className={styles.sessionMetaRow}>
                        <span className={styles.sessionMetaItem}>
                          <IonIcon icon={calendarOutline} className={styles.sessionMetaIcon} />
                          { request.date + ' ' + request.time }
                        </span>
                        {request.location && (
                          <span className={styles.sessionMetaItem}>
                            <IonIcon icon={locationOutline} className={styles.sessionMetaIcon} />
                            {request.location}
                          </span>
                        )}
                        {(() => {
                          const photographerName = getPhotographerName(request.photographer_id);
                          return photographerName && (
                            <span className={styles.sessionMetaItem}>
                              <IonIcon icon={personOutline} className={styles.sessionMetaIcon} />
                              {photographerName}
                            </span>
                          );
                        })()}
                        <span className={styles.sessionAmountItem}>
                          <IonIcon icon={cashOutline} className={styles.sessionAmountIcon} />
                          {request.amount?.toLocaleString?.() ?? 0} ₽
                        </span>
                      </div>
                    </div>
                    <div className={styles.sessionRight}>
                      <IonBadge color={getStatusColor(request)} className={styles.sessionBadge}>
                        {getStatusLabel(request)}
                      </IonBadge>
                    </div>
                  </div>
                </IonItem>
              ))
            ) : (
              <div className={styles.sessionsEmpty}>
                <div className={styles.sessionsEmptyIconBox}>
                  <IonIcon icon={cameraOutline} className={styles.sessionsEmptyIcon} />
                </div>
                <h3 className={styles.sessionsEmptyTitle}>Нет активных заявок</h3>
                <p className={styles.sessionsEmptyText}>
                  Все заявки обработаны или ещё не поступили
                </p>
              </div>
            )}
          </IonList>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
