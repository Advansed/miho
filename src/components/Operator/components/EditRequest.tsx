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
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  cashOutline,
  personOutline,
  saveOutline,
  flagOutline,
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import { Session, SessionStatus, useUserStore } from '../../Store/sessionStore';
import { usePhotographer } from '../../Store/usePhotographer';

const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'planned', label: 'Назначена' },
  { value: 'in_progress', label: 'Идёт съёмка' },
  { value: 'pending_payment', label: 'Ожидает оплаты' },
  { value: 'completed', label: 'Завершена' },
];

interface EditRequestProps {
  request: Session;
  onClose: () => void;
  onSave: (
    id: string,
    data: Partial<Session>
  ) => Promise<void>;
  isLoading?: boolean;
}

const EditRequest: React.FC<EditRequestProps> = ({
  request,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const sessionTypes = useUserStore((s) => s.session_types);
  const { photographers } = usePhotographer();

  const [showTypeList, setShowTypeList] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const [showPhotographerList, setShowPhotographerList] = useState(false);
  const [editedSession, setEditedSession] = useState<Session>({
    ...request,
    date: request.date || new Date().toISOString().split('T')[0],
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const hasChanges =
    editedSession.date !== request.date ||
    editedSession.time !== request.time ||
    editedSession.location !== (request.location ?? '') ||
    editedSession.type !== request.type ||
    editedSession.photographer_id !== request.photographer_id ||
    editedSession.status !== request.status ||
    editedSession.amount !== (request.amount ?? 0);

  const handleDateTimeChange = (value: string | null | undefined) => {
    if (!value) return;
    const s = String(value);
    const [d, t] = s.split('T');
    if (d || t) {
      setEditedSession(prev => ({
        ...prev,
        date: d || prev.date,
        time: t ? t.slice(0, 5) : prev.time,
      }));
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      console.log('request', request)
      console.log('editedSession', editedSession)
      await onSave(request.id, {
        date:         editedSession.date !== request.date ? editedSession.date : undefined,
        time:         editedSession.time !== request.time ? editedSession.time : undefined,
        location:     editedSession.location !== (request.location ?? '') ? editedSession.location : undefined,
        type:         editedSession.type !== request.type ? editedSession.type : undefined,
        photographer_id:   editedSession.photographer_id !== request.photographer_id ? editedSession.photographer_id || undefined : undefined,
        status:       editedSession.status !== request.status ? editedSession.status as SessionStatus : undefined,
        amount:       editedSession.amount !== (request.amount ?? 0) ? editedSession.amount || 0 : undefined,
      });
      onClose();
    } finally {
      setSaveLoading(false);
    }
  };

  const typeName = sessionTypes.find((t) => t.id === editedSession.type)?.name ?? 'Выберите тип';
  const selectedPhotographer = photographers.find((p) => p.id === editedSession.photographer_id);
  const photographerName = selectedPhotographer?.name || 'Назначить фотографа';
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === editedSession.status as SessionStatus)?.label ?? 'Статус';

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
            Редактирование заявки #{request.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.pageContent} scrollY>
        <div className={styles.pageContainer}>
          <div className={`${styles.pageCard} ${styles.pageCardCompact} ${styles.formCardWithGrid}`}>
            <div className={styles.formSectionsGrid}>
            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={cameraOutline} className={styles.sectionIcon} />
                Тип съёмки
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
                <IonLabel>{typeName}</IonLabel>
              </IonItem>
              {showTypeList && (
                <div className={styles.sessionTypeList}>
                  {sessionTypes.map((type) => (
                    <IonItem
                      key={type.id}
                      button
                      lines="full"
                      className={styles.sessionTypeItem}
                      onClick={() => {
                        setEditedSession(prev => ({ ...prev, type: type.id }));
                        setShowTypeList(false);
                      }}
                    >
                      <IonIcon slot="start" icon={cameraOutline} />
                      <IonLabel>{type.name}</IonLabel>
                    </IonItem>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={calendarOutline} className={styles.sectionIcon} />
                Дата и время
              </h4>
              <IonItem className={styles.formItemCompact} lines="full">
                <IonLabel position="stacked">Дата и время</IonLabel>
                <IonInput
                  type="datetime-local"
                  value={editedSession.date && editedSession.time ? `${editedSession.date}T${editedSession.time}` : ''}
                  min={`${getTodayDate()}T00:00`}
                  onIonChange={(e) => handleDateTimeChange(e.detail.value as string)}
                  disabled={isLoading}
                >
                  <IonIcon slot="start" icon={calendarOutline} color="primary" />
                </IonInput>
              </IonItem>
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={locationOutline} className={styles.sectionIcon} />
                Место
              </h4>
              <IonItem className={styles.formItemCompact} lines="full">
                <IonLabel position="stacked">Место съёмки / адрес</IonLabel>
                <IonInput
                  value={editedSession.location ?? ''}
                  placeholder="Уточните место"
                  onIonInput={(e) => setEditedSession(prev => ({ ...prev, location: e.detail.value ?? '' }))}
                  disabled={isLoading}
                >
                  <IonIcon slot="start" icon={locationOutline} color="primary" />
                </IonInput>
              </IonItem>
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={personOutline} className={styles.sectionIcon} />
                Фотограф
              </h4>
              <IonLabel className={styles.sessionTypeLabel}>Фотограф</IonLabel>
              <IonItem
                button
                lines="full"
                className={styles.sessionTypeItem}
                onClick={() => setShowPhotographerList((v) => !v)}
                disabled={isLoading}
              >
                <IonIcon slot="start" icon={personOutline} />
                <IonLabel>{photographerName}</IonLabel>
              </IonItem>
              {showPhotographerList && (
                <div className={styles.sessionTypeList}>
                  <IonItem
                    button
                    lines="full"
                    className={styles.sessionTypeItem}
                    onClick={() => {
                      setEditedSession(prev => ({ ...prev, photographer_id: '' }));
                      setShowPhotographerList(false);
                    }}
                  >
                    <IonIcon slot="start" icon={personOutline} />
                    <IonLabel>Не назначен</IonLabel>
                  </IonItem>
                  {photographers.map((photographer) => (
                    <IonItem
                      key={photographer.id}
                      button
                      lines="full"
                      className={`${styles.sessionTypeItem} ${editedSession.photographer_id === photographer.id ? styles.sessionTypeItemSelected : ''}`}
                      onClick={() => {
                        setEditedSession(prev => ({ ...prev, photographer_id: photographer.id }));
                        setShowPhotographerList(false);
                      }}
                    >
                      <IonIcon slot="start" icon={personOutline} />
                      <IonLabel>{photographer.name}</IonLabel>
                    </IonItem>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={flagOutline} className={styles.sectionIcon} />
                Статус
              </h4>
              <IonLabel className={styles.sessionTypeLabel}>Статус заявки</IonLabel>
              <IonItem
                button
                lines="full"
                className={styles.sessionTypeItem}
                onClick={() => setShowStatusList((v) => !v)}
                disabled={isLoading}
              >
                <IonIcon slot="start" icon={flagOutline} />
                <IonLabel>{statusLabel}</IonLabel>
              </IonItem>
              {showStatusList && (
                <div className={styles.sessionTypeList}>
                  {STATUS_OPTIONS.map((opt) => (
                    <IonItem
                      key={opt.value}
                      button
                      lines="full"
                      className={`${styles.sessionTypeItem} ${editedSession.status === opt.value ? styles.sessionTypeItemSelected : ''}`}
                      onClick={() => {
                        setEditedSession(prev => ({ ...prev, status: opt.value }));
                        setShowStatusList(false);
                      }}
                      disabled={isLoading}
                    >
                      <IonIcon slot="start" icon={flagOutline} />
                      <IonLabel>{opt.label}</IonLabel>
                    </IonItem>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formSectionCompact}>
              <h4 className={styles.sectionTitleCompact}>
                <IonIcon icon={cashOutline} className={styles.sectionIcon} />
                Цена
              </h4>
              <IonItem className={styles.formItemCompact} lines="full">
                <IonLabel position="stacked">Стоимость (₽)</IonLabel>
                <IonInput
                  type="number"
                  value={String(editedSession.amount ?? 0)}
                  min={0}
                  onIonInput={(e) => setEditedSession(prev => ({ ...prev, amount: Number(e.detail.value ?? '0') }))}
                  disabled={isLoading}
                >
                  <IonIcon slot="start" icon={cashOutline} color="primary" />
                </IonInput>
              </IonItem>
            </div>
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
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditRequest;
