import React, { useState, useCallback, useMemo } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAlert,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import styles from '../Styles.module.css';
import { useLoginStore } from '../../Login/LoginStore';
import { useToast } from '../../Toast';
import { Session } from '../../Store/sessionStore';
import { useSession } from '../../User/useSession';
import RequestList from './RequestList';
import NextSessionCard from '../../Photographer/components/NextSession';

type CategoryType = 'drafts' | 'planned' | 'in_progress' | 'awaiting_payment' | 'archive' | null;

const isRequestIncomplete = (r: Session): boolean => {
  return r.status !== 'completed' || !r.isPaid;
};

const getCategoryCounts = (requests: Session[]) => {
  let drafts = 0;
  let planned = 0;
  let inProgress = 0;
  let awaitingPayment = 0;
  let archiveCompleted = 0;

  for (const r of requests) {
    if (r.status === 'draft') drafts += 1;
    if (r.status === 'planned') planned += 1;
    if (r.status === 'in_progress') inProgress += 1;
    if (r.status === 'pending_payment' || (r.status === 'completed' && !r.isPaid)) {
      awaitingPayment += 1;
    }
    if (r.status === 'completed' && r.isPaid) {
      archiveCompleted += 1;
    }
  }

  return { drafts, planned, inProgress, awaitingPayment, archiveCompleted };
};

const filterByCategory = (requests: Session[], category: CategoryType): Session[] => {
  if (!category) return requests;
  if (category === 'drafts') return requests.filter((r) => r.status === 'draft');
  if (category === 'planned') return requests.filter((r) => r.status === 'planned');
  if (category === 'in_progress') return requests.filter((r) => r.status === 'in_progress');
  if (category === 'awaiting_payment') {
    return requests.filter(
      (r) => r.status === 'pending_payment' || (r.status === 'completed' && !r.isPaid)
    );
  }
  if (category === 'archive') {
    return requests.filter((r) => r.status === 'completed' && r.isPaid);
  }
  return requests;
};

const getCategoryTitle = (category: CategoryType): string => {
  if (!category) return 'Заявки (не завершены)';
  if (category === 'drafts') return 'Черновики';
  if (category === 'planned') return 'Запланированные';
  if (category === 'in_progress') return 'В съёмке';
  if (category === 'awaiting_payment') return 'Ожидающие оплату';
  if (category === 'archive') return 'Архив завершённых';
  return 'Заявки';
};

export interface OperatorDashboardProps {
  onClose?: () => void;
  onOpenRequest?: (request: Session) => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  onClose,
  onOpenRequest,
}) => {
  const { reset: resetLoginStore } = useLoginStore();
  const {
    sessions,
    nextSession,
    loading,
    set_loading,
    get_datas,
  } = useSession();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const toast = useToast();

  const loadData = useCallback(async () => {
    try {
      set_loading( true )
      await get_datas();
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      toast.error('Не удалось загрузить заявки');
    } finally {
      set_loading( false )
    }
  }, [get_datas, toast]);


  const handleOpenRequest = (request: Session) => {
    if (onOpenRequest) onOpenRequest(request);
    else toast.info(`Заявка #${request.id} — в разработке`);
  };

  const handleLogout = () => {
    resetLoginStore();
    toast.info('Вы вышли из системы');
  };

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

  const formatShortDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Вычисляем ближайшую сессию для оператора
  const nearestSession = useMemo(() => {
    if (nextSession) return nextSession;

    const incompleteSessions = sessions.filter(isRequestIncomplete);
    if (incompleteSessions.length === 0) return null;

    const now = new Date();
    const upcomingSessions = incompleteSessions
      .map(session => {
        const sessionDate = new Date(`${session.date}T${session.time || '00:00:00'}`);
        return { session, date: sessionDate };
      })
      .filter(({ date }) => date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return upcomingSessions.length > 0 ? upcomingSessions[0].session : null;
  }, [nextSession, sessions]);

  const {
    drafts,
    planned,
    inProgress,
    awaitingPayment,
    archiveCompleted,
  } = getCategoryCounts(sessions);

  const listRequests = selectedCategory
    ? filterByCategory(sessions, selectedCategory)
    : sessions.filter(isRequestIncomplete);
  const listTitle = getCategoryTitle(selectedCategory);

  return (
    <IonPage className={styles.container}>
      <IonHeader translucent>
        <IonToolbar className={styles.toolbar}>
          <IonTitle className={styles.toolbarTitle}>
            Панель оператора
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowLogoutAlert(true)} className={styles.logoutButton}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles.container}>
        <div className={styles.summaryGrid}>
          <button
            type="button"
            className={`${styles.summaryCard} ${styles.summaryCardButton} ${styles.summaryDrafts} ${selectedCategory === 'drafts' ? styles.summaryCardSelected : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'drafts' ? null : 'drafts')}
          >
            <div className={styles.summaryLabel}>Черновики</div>
            <div className={styles.summaryValue}>{drafts}</div>
          </button>
          <button
            type="button"
            className={`${styles.summaryCard} ${styles.summaryCardButton} ${styles.summaryPlanned} ${selectedCategory === 'planned' ? styles.summaryCardSelected : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'planned' ? null : 'planned')}
          >
            <div className={styles.summaryLabel}>Запланированные</div>
            <div className={styles.summaryValue}>{planned}</div>
          </button>
          <button
            type="button"
            className={`${styles.summaryCard} ${styles.summaryCardButton} ${styles.summaryInProgress} ${selectedCategory === 'in_progress' ? styles.summaryCardSelected : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'in_progress' ? null : 'in_progress')}
          >
            <div className={styles.summaryLabel}>В съёмке</div>
            <div className={styles.summaryValue}>{inProgress}</div>
          </button>
          <button
            type="button"
            className={`${styles.summaryCard} ${styles.summaryCardButton} ${styles.summaryAwaitingPayment} ${selectedCategory === 'awaiting_payment' ? styles.summaryCardSelected : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'awaiting_payment' ? null : 'awaiting_payment')}
          >
            <div className={styles.summaryLabel}>Ожидающие оплату</div>
            <div className={styles.summaryValue}>{awaitingPayment}</div>
          </button>
          <button
            type="button"
            className={`${styles.summaryCard} ${styles.summaryCardButton} ${styles.summaryArchive} ${selectedCategory === 'archive' ? styles.summaryCardSelected : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'archive' ? null : 'archive')}
          >
            <div className={styles.summaryLabel}>Архив завершённых</div>
            <div className={styles.summaryValue}>{archiveCompleted}</div>
          </button>
        </div>

        <NextSessionCard
          loading={loading}
          nextSession={nearestSession}
          onOpenSession={handleOpenRequest}
          formatDate={formatDate}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
        />

        <RequestList
          requests        = { listRequests }
          listTitle       = { listTitle }
          loading         = { loading }
          onRefresh       = { loadData }
          onOpenRequest   = { handleOpenRequest }
          formatShortDate = { formatShortDate }
        />
      </IonContent>

      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Выход"
        message="Выйти из панели оператора?"
        buttons={[
          { text: 'Отмена', role: 'cancel' },
          { text: 'Выйти', handler: handleLogout },
        ]}
      />
    </IonPage>
  );
};

export default OperatorDashboard;
