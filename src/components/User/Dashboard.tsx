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
import styles from './Styles.module.css';
import { useLoginStore } from '../Login/LoginStore';
import UserStats from './UserStats';
import NextSessionCard from './NextSession';
import ClientSessionsList from './SessionList';
import { useToast } from '../Toast';
import { useSession } from './useSession'; // Импортируем хук для работы с сессиями
import AddSessionModal from './NewSession';

type SessionStatus = 'planned' | 'pending_payment' | 'finished';

interface UserSession {
  id: number;
  date: string;
  type: string;
  locationHint?: string;
  status: SessionStatus;
  isPaid: boolean;
  amount: number;
}

interface DashProps {
  onClose?:  () => void;
  onNew?:    () => Promise<void>;
}


const getStatusLabel = (session: UserSession) => {
  if (!session.isPaid && session.status !== 'finished') return 'Ожидает оплаты';
  if (session.status === 'planned') return 'Назначена';
  if (session.status === 'finished') return 'Завершена';
  return 'В обработке';
};

const getStatusColor = (session: UserSession) => {
  if (!session.isPaid && session.status !== 'finished') return 'warning';
  if (session.status === 'planned') return 'primary';
  if (session.status === 'finished') return 'success';
  return 'medium';
};

const UserDashboard: React.FC<DashProps> = ({onClose, onNew}) => {
  const { name, email, phone, role, token, reset: resetLoginStore } = useLoginStore();

  // Используем хук useSession вместо локального состояния
  const { 
    sessions, 
    stats, 
    nextSession, 
    loading, 
    error, 
    fetchSessions 
  } = useSession();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [ add, setAdd ] = useState( false)
  const toast = useToast()

  useEffect(() => {
    if (token) {
      fetchSessions( token );
    }
  }, [token]);

  const loadDashboardData = async () => {
    if (!token) {
      toast.error('Токен не найден. Пожалуйста, войдите снова.');
      return;
    }
    
    try {
      await fetchSessions(token);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      toast.error('Не удалось загрузить данные сессий');
    }
  };

  const handleCreateOrder = () => {
    
    if(onNew) onNew()

    //toast.info('Функционал создания заказа в разработке');
  };

  const handleOpenSession = (id: number) => {
    toast.info(`Открытие деталей сессии #${id} в разработке`);
  };

  const handlePaySession = (id: number) => {
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
        {/* Показываем ошибку, если она есть */}
        {error && (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            color="danger"
            onDidDismiss={() => {}}
          />
        )}

        <UserStats 
            displayName={displayName}
            email={email}
            phone={phone}
            isPhotographer={false}
            total={stats?.total || 0}
            upcoming={stats?.upcoming || 0}
            completed={stats?.completed || 0}
            totalAmount={stats?.totalAmount || 0}
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
          sessions={sessions}
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