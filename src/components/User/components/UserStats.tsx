// src/UserDashboard/UserStats.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import {
  cameraOutline,
  calendarOutline,
  checkmarkCircleOutline,
  cashOutline,
  personOutline,
  mailOutline,
  callOutline,
  addCircleOutline
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import type { SessionsStats } from '../../Store/sessionStore';

export interface UserStatsProps {
  displayName: string;
  email?: string | null;
  phone?: string | null;
  isPhotographer: boolean;
  stats?: SessionsStats | null;
  onCreateOrder: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({
  displayName,
  email,
  phone,
  isPhotographer,
  stats,
  onCreateOrder
}) => {
  const contact = email || phone;
  const total = stats?.total ?? 0;
  const upcoming = stats?.upcoming ?? 0;
  const completed = stats?.completed ?? 0;
  const totalAmount = stats?.totalAmount ?? 0;

  return (
    <>
        <div className={`${styles.card} ${styles.cardWrapper}`}>
        {/* Верхний блок с именем и кнопкой */}
        <div className={styles.headerBlock}>
            <div className={styles.headerLeft}>
            <h1 className={styles.title}>{displayName}</h1>
            <div className={styles.userInfoRow}>
                <span className={styles.userInfoItem}>
                <IonIcon icon={personOutline} className={styles.userInfoIcon} />
                {isPhotographer ? 'Фотограф' : 'Клиент'}
                </span>

                {contact && (
                <span className={styles.userInfoItem}>
                    <IonIcon
                    icon={email ? mailOutline : callOutline}
                    className={styles.userInfoIcon}
                    />
                    {contact}
                </span>
                )}
            </div>
            </div>

            <IonButton
            className={`${styles.button} ${styles.newShootButton}`}
            onClick={onCreateOrder}
            >
            <IonIcon slot="start" icon={addCircleOutline} />
            Новая съёмка
            </IonButton>
        </div>

        {/* Статистика */}
        <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.statCardTotal}`}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxBlue}`}>
                <IonIcon icon={cameraOutline} className={styles.statIconBlue} />
            </div>
            <div>
                <h3 className={styles.statValue}>{total}</h3>
                <p className={styles.statLabel}>Всего сессий</p>
            </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardUpcoming}`}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxYellow}`}>
                <IonIcon icon={calendarOutline} className={styles.statIconYellow} />
            </div>
            <div>
                <h3 className={styles.statValue}>{upcoming}</h3>
                <p className={styles.statLabel}>Предстоящих</p>
            </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardCompleted}`}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxGreen}`}>
                <IonIcon icon={checkmarkCircleOutline} className={styles.statIconGreen} />
            </div>
            <div>
                <h3 className={styles.statValue}>{completed}</h3>
                <p className={styles.statLabel}>Завершено</p>
            </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardAmount}`}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxPurple}`}>
                <IonIcon icon={cashOutline} className={styles.statIconPurple} />
            </div>
            <div>
                <h3 className={styles.statAmountValue}>
                {totalAmount.toLocaleString()} ₽
                </h3>
                <p className={styles.statLabel}>Общая сумма</p>
            </div>
            </div>
        </div>
        </div>
    </>
  );
};

export default UserStats;
