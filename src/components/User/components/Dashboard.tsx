import React, { useState, useEffect } from 'react';
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
  IonBadge,
  IonSkeletonText,
  IonAlert,
  IonToast,
  IonList
} from '@ionic/react';
import {
  addCircleOutline,
  logOutOutline,
  cameraOutline,
  refreshOutline,
  calendarOutline,
  locationOutline,
  cashOutline,
  personOutline,
  mailOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import { useLoginStore } from '../../Login/LoginStore';
import UserStats from './UserStats';
import NextSessionCard from './NextSession';
import ClientSessionsList from './SessionList';
import { useToast } from '../../Toast';
import { useSession } from '../useSession';
import AddSessionModal from './NewSession';
import type { Session } from '../../Store/sessionStore';
import { usePhotographer } from '../../Store/usePhotographer';

interface DashProps {
  onClose?:  () => void;
  onNew?:    () => Promise<void>;
  onOpenSession?: (session: Session) => void;
}


const getStatusLabel = (session: Session) => {
  if (session.status === 'draft') return 'Черновик';
  if (session.status === 'planned') return 'Назначена';
  if (session.status === 'in_progress') return 'Идет съемка';
  if (session.status === 'completed' && !session.isPaid) return 'Ждет оплаты';
  if (session.status === 'completed' && session.isPaid) return 'Завершена';
  return 'В обработке';
};

const getStatusColor = (session: Session) => {
  if (session.status === 'draft') return 'light';
  if (session.status === 'planned') return 'primary';
  if (session.status === 'in_progress') return 'secondary';
  if (session.status === 'completed' && !session.isPaid) return 'warning';
  if (session.status === 'completed' && session.isPaid) return 'success';
  return 'medium';
};

const UserDashboard: React.FC<DashProps> = ({ onClose, onNew, onOpenSession }) => {
  const { name, email, phone, role, token, reset: resetLoginStore } = useLoginStore();

  const {
    stats,
    nextSession,
    loading,
    get_datas,
  } = useSession();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [add, setAdd] = useState(false);
  const toast = useToast();

  const loadDashboardData = async () => {
    try {
      await get_datas();
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      toast.error('Не удалось загрузить данные сессий');
    }
  };

  const handleCreateOrder = () => {

    if(onNew) onNew()
  };

  const handleOpenSession = (session: Session) => {
    if (onOpenSession) onOpenSession( session );
    else toast.info(`Открытие деталей сессии #${session.id} в разработке`);
  };

  const handlePaySession = (id: string) => {
    toast.info(`Оплата сессии #${id} в разработке`);
  };

  const handleLogout = () => {
    resetLoginStore();
    toast.info('Вы вышли из системы');
  };

  const confirmLogout = () => {
    setShowLogoutAlert(true);
  };

  const displayName = name || email || phone || 'клиент';
  const isPhotographer = role === 'photographer';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <IonPage className={styles.container}>
      <IonHeader translucent>
        <IonToolbar className={styles.toolbar}>
          <IonTitle className={styles.toolbarTitle}>
            Личный кабинет
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={confirmLogout} className={styles.logoutButton}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles.container}>
        <UserStats
          displayName={displayName}
          email={email}
          phone={phone}
          isPhotographer={isPhotographer}
          stats={stats}
          onCreateOrder={handleCreateOrder}
        />

        <NextSessionCard
            loading={loading}
            nextSession={nextSession}
            onPaySession={handlePaySession}
            onOpenSession={handleOpenSession}
            onCreateOrder={handleCreateOrder}
            formatDate={formatDate}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
        />

        <ClientSessionsList
          loading={loading}
          onRefresh={loadDashboardData}
          onOpenSession={handleOpenSession}
          onPaySession={handlePaySession}
          onCreateOrder={handleCreateOrder}
          formatShortDate={formatShortDate}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
        />

      </IonContent>

      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Выход из системы"
        message="Вы уверены, что хотите выйти из личного кабинета?"
        buttons={[
          {
            text: 'Отмена',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Выйти',
            handler: handleLogout
          }
        ]}
      />

    </IonPage>
  );
};

export default UserDashboard;
