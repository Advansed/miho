import React, { useState } from 'react';
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
  IonLabel,
  IonInput,
  IonAlert,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  cashOutline,
  closeCircleOutline,
  saveOutline,
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import type { Session, SessionType } from '../../Store/sessionStore';
import { useUserStore } from '../../Store/sessionStore';

interface EditSessionProps {
  session: Session;
  onClose: () => void;
  onCancel: () => Promise<void>;
  onSave: (data: Partial<Session>) => Promise<void>;
  isLoading?: boolean;
}

const EditSession: React.FC<EditSessionProps> = ({
  session,
  onClose,
  onCancel,
  onSave,
  isLoading = false,
}) => {
  const session_types = useUserStore((s) => s.session_types);

  const getSessionTypeId = (s: Session): string => {
    const t = s.type;
    return typeof t === 'string' ? t : '';
  };

  const getSessionTypeName = (s: Session): string => {
    const t = s.type;
    const typeId = typeof t === 'string' ? t : (t as SessionType)?.id;
    return typeId ? session_types.find((st) => st.id === typeId)?.name ?? '' : '';
  };

  const initialTypeId = getSessionTypeId(session);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const [editedDate, setEditedDate] = useState(session.date);
  const [editedTime, setEditedTime] = useState(session.time);
  const [editedSessionTypeId, setEditedSessionTypeId] = useState(initialTypeId);
  const [saveLoading, setSaveLoading] = useState(false);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const hasChanges =
    editedDate           !== session.date
    editedTime           !== session.time
    editedSessionTypeId  !== initialTypeId;

  const handleDateTimeChange = (value: string | null | undefined) => {
    if (!value) return;
    const s = String(value);
    const [datePart, timePart] = s.split('T');
    if (datePart) setEditedDate(datePart);
    if (timePart) setEditedTime(timePart.slice(0, 5));
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    await onCancel();
    onClose();
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaveLoading(true);
    try {
      await onSave({
        id:   session.id,
        date: editedDate,
        time: editedTime,
        type: editedSessionTypeId,
      });
      onClose();
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className={styles.toolbar}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.toolbarTitle}>
            Редактирование сессии
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.pageContent} scrollY>
        <div className={styles.pageContainer}>
          <div className={`${styles.pageCard} ${styles.pageCardCompact}`}>
            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={cameraOutline} className={styles.sectionIcon} />
                Информация о сессии
              </h4>

              <IonLabel className={styles.sessionTypeLabel}>Тип сессии</IonLabel>
              <IonItem
                button
                lines="full"
                className={styles.sessionTypeItem}
                onClick={() => setShowTypeList((v) => !v)}
                disabled={isLoading}
              >
                <IonIcon slot="start" icon={cameraOutline} />
                <IonLabel>
                  {editedSessionTypeId
                    ? session_types.find((t) => t.id === editedSessionTypeId)
                        ?.name ?? getSessionTypeName(session)
                    : 'Выберите тип'}
                </IonLabel>
              </IonItem>
              {showTypeList && (
                <div className={styles.sessionTypeList}>
                  {session_types.map((type) => (
                    <IonItem
                      key={type.id ?? type.name}
                      button
                      lines="full"
                      className={styles.sessionTypeItem}
                      onClick={() => {
                        setEditedSessionTypeId(type.id);
                        setShowTypeList(false);
                      }}
                      disabled={isLoading}
                    >
                      <IonIcon slot="start" icon={cameraOutline} />
                      <IonLabel>{type.name}</IonLabel>
                    </IonItem>
                  ))}
                </div>
              )}

              <IonItem className={styles.formItemCompact} lines="full">
                <IonLabel position="stacked">Дата и время</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={
                    editedDate && editedTime
                      ? `${editedDate}T${editedTime}`
                      : ''
                  }
                  min={`${getTodayDate()}T00:00`}
                  onIonChange={(e) =>
                    handleDateTimeChange(e.detail.value as string)
                  }
                  disabled={isLoading}
                >
                  <IonIcon slot="start" icon={calendarOutline}  color = "primary"/>
                </IonInput>
              </IonItem>

              {session.location && (
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonIcon slot="start" icon={locationOutline} color='primary'/>
                  <IonLabel>{session.location}</IonLabel>
                </IonItem>
              )}
              <IonItem className={styles.formItemCompact} lines="full">
                <IonIcon slot="start" icon={cashOutline} color = 'primary'/>
                <IonLabel>
                  {session.amount.toLocaleString()} ₽
                  {session.isPaid && ' • Оплачено'}
                </IonLabel>
              </IonItem>
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>Действия</h4>
              {hasChanges && (
                <IonButton
                  expand="block"
                  color="primary"
                  className={styles.editSessionButton}
                  onClick={handleSave}
                  disabled={isLoading || saveLoading}
                >
                  {saveLoading ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon slot="start" icon={saveOutline} />
                      Сохранить
                    </>
                  )}
                </IonButton>
              )}
              <IonButton
                expand="block"
                fill="outline"
                color="danger"
                className={styles.editSessionButton}
                onClick={() => setShowCancelConfirm(true)}
                disabled={isLoading}
              >
                <IonIcon slot="start" icon={closeCircleOutline} />
                Отменить сессию
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showCancelConfirm}
        onDidDismiss={() => setShowCancelConfirm(false)}
        header="Отменить сессию?"
        message="Вы уверены, что хотите отменить эту фотосессию? Это действие нельзя отменить."
        buttons={[
          { text: 'Нет', role: 'cancel' },
          {
            text: 'Да, отменить',
            role: 'destructive',
            handler: handleCancelConfirm,
          },
        ]}
      />
    </IonPage>
  );
};

export default EditSession;
