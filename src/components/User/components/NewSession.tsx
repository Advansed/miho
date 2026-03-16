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
  IonTextarea,
  IonNote,
  IonGrid,
  IonAlert,
  IonSpinner
} from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  addCircleOutline
} from 'ionicons/icons';
import styles from '../Styles.module.css';
import { Session, useUserStore } from '../../Store/sessionStore';
import { useUserData } from '../../Login/LoginStore';

interface NewSessionPageProps {
  onSubmit: (sessionData: Partial<Session>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const NewSessionPage: React.FC<NewSessionPageProps> = ({
  onSubmit,
  onClose,
  isLoading = false
}) => {
  const session_types = useUserStore(s => s.session_types);
  const { name, phone, email } = useUserData();

  const [formData, setFormData] = useState<Partial<Session> & { notes?: string }>(() => ({
    type: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    name: name ?? '',
    phone: phone ?? '',
    email: email ?? ''
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showSessionTypes, setShowSessionTypes] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.type?.trim()) {
      newErrors.type = 'Выберите тип фотосессии';
    }
    if (!formData.date || !formData.time) {
      newErrors.date = 'Выберите дату и время съемки';
    }
    if (
      !formData.name?.trim() &&
      !formData.phone?.trim() &&
      !formData.email?.trim()
    ) {
      newErrors.clientInfo = 'Заполните хотя бы одно поле контактов клиента';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { notes, ...payload } = formData;
    await onSubmit(payload);

    if (!isLoading) {
      resetForm();
      if (onClose) onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      date: '',
      time: '',
      location: '',
      notes: '',
      name: name ?? '',
      phone: phone ?? '',
      email: email ?? ''
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof (Partial<Session> & { notes?: string }), value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    if (field === 'name' || field === 'phone' || field === 'email') {
      if (errors.clientInfo) {
        setErrors(prev => ({
          ...prev,
          clientInfo: ''
        }));
      }
    }
  };

  const handleBack = () => {
   
     onClose();
  };

  const handleForceBack = () => {
    resetForm();
  };

  const selectedTypeName =
    session_types.find(t => t.id === formData.type)?.name ?? '';

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleDateTimeChange = (value: string | null | undefined) => {
    if (!value) return;
    const s = value.toString();
    const [datePart, timePart] = s.split('T');
    if (datePart) handleInputChange('date', datePart);
    if (timePart) handleInputChange('time', timePart.slice(0, 5));
  };

  return (
    <IonPage>
      <IonHeader className={styles.toolbar}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBack}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.toolbarTitle}>
            Новая фотосессия
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.pageContent} scrollY>
        <div className={styles.pageContainer}>
          <div className={`${styles.pageCard} ${styles.pageCardCompact}`}>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className={styles.formSectionCompact}>
                <h4 className={styles.sectionTitleCompact}>
                  <IonIcon icon={cameraOutline} className={styles.sectionIcon} />
                  Детали
                </h4>
                <IonLabel className={styles.sessionTypeLabel}>
                  Тип <span className={styles.required}>*</span>
                </IonLabel>
                <IonItem
                  button
                  lines="full"
                  className={`${styles.sessionTypeItem} ${
                    errors.type ? styles.inputError : ''
                  }`}
                  onClick={() => !isLoading && setShowSessionTypes(v => !v)}
                  disabled={isLoading}
                >
                  <IonIcon slot="start" icon={cameraOutline} />
                  <IonLabel>
                    {selectedTypeName || 'Выберите тип'}
                  </IonLabel>
                </IonItem>
                {showSessionTypes && (
                  <div className={styles.sessionTypeList}>
                    {session_types.map(type => (
                      <IonItem
                        key={type.id ?? type.name}
                        button
                        lines="full"
                        className={styles.sessionTypeItem}
                        onClick={() => {
                          handleInputChange('type', type.id);
                          setShowSessionTypes(false);
                        }}
                        disabled={isLoading}
                      >
                        <IonIcon slot="start" icon={cameraOutline} />
                        <IonLabel>{type.name}</IonLabel>
                      </IonItem>
                    ))}
                  </div>
                )}
                {errors.type && (
                  <IonNote color="danger" className={styles.errorNote}>
                    {errors.type}
                  </IonNote>
                )}
                <IonGrid>
                  <IonItem className={styles.formItemCompact} lines="full">
                    <IonLabel position="stacked">
                      Дата и время <span className={styles.required}>*</span>
                    </IonLabel>
                    <IonInput
                      type="datetime-local"
                      value={
                        formData.date && formData.time
                          ? `${formData.date}T${formData.time}`
                          : ''
                      }
                      min={`${getTodayDate()}T00:00`}
                      onIonChange={e =>
                        handleDateTimeChange(e.detail.value as string)
                      }
                      disabled={isLoading}
                      className={errors.date ? styles.inputError : ''}
                    >
                      <IonIcon slot="start" icon={calendarOutline} />
                    </IonInput>
                    {errors.date && (
                      <IonNote slot="error" color="danger">
                        {errors.date}
                      </IonNote>
                    )}
                  </IonItem>
                </IonGrid>
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonLabel position="stacked">Локация</IonLabel>
                  <IonInput
                    value={formData.location}
                    placeholder="Парк, студия..."
                    onIonChange={e =>
                      handleInputChange('location', e.detail.value)
                    }
                    disabled={isLoading}
                  >
                    <IonIcon slot="start" icon={locationOutline} />
                  </IonInput>
                </IonItem>
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonLabel position="stacked">Заметки</IonLabel>
                  <IonTextarea
                    value={formData.notes}
                    placeholder="Пожелания, детали..."
                    rows={2}
                    onIonChange={e =>
                      handleInputChange('notes', e.detail.value)
                    }
                    disabled={isLoading}
                  />
                </IonItem>
              </div>

              <div className={styles.formSectionCompact}>
                <h4 className={styles.sectionTitleCompact}>
                  Контакты клиента
                </h4>
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonLabel position="stacked">Имя</IonLabel>
                  <IonInput
                    value={formData.name}
                    placeholder="Имя"
                    onIonChange={e =>
                      handleInputChange('name', e.detail.value)
                    }
                    disabled={isLoading}
                  />
                </IonItem>
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonLabel position="stacked">Телефон</IonLabel>
                  <IonInput
                    type="tel"
                    value={formData.phone}
                    placeholder="+7 (999) 123-45-67"
                    onIonChange={e =>
                      handleInputChange('phone', e.detail.value)
                    }
                    disabled={isLoading}
                  />
                </IonItem>
                <IonItem className={styles.formItemCompact} lines="full">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    placeholder="email@example.com"
                    onIonChange={e =>
                      handleInputChange('email', e.detail.value)
                    }
                    disabled={isLoading}
                  />
                </IonItem>
                {errors.clientInfo && (
                  <IonNote color="danger" className={styles.errorNote}>
                    {errors.clientInfo}
                  </IonNote>
                )}
              </div>

              <div className={styles.formActions}>
                <IonButton
                  type="button"
                  expand="block"
                  color="medium"
                  onClick={handleBack}
                  disabled={isLoading}
                  className={styles.cancelButton}
                >
                  Отмена
                </IonButton>
                <IonButton
                  type="submit"
                  expand="block"
                  color="primary"
                  disabled={isLoading}
                  className={styles.submitButton}
                >
                  {isLoading ? (
                    <>
                      <IonSpinner name="crescent" />
                      <span style={{ marginLeft: '8px' }}>Создание...</span>
                    </>
                  ) : (
                    <>
                      <IonIcon icon={addCircleOutline} slot="start" />
                      Создать фотосессию
                    </>
                  )}
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showConfirmLeave}
        onDidDismiss={() => setShowConfirmLeave(false)}
        header="Уйти со страницы?"
        message="У вас есть несохраненные изменения. Вы уверены, что хотите уйти?"
        buttons={[
          {
            text: 'Продолжить редактирование',
            role: 'cancel'
          },
          {
            text: 'Уйти',
            handler: handleForceBack
          }
        ]}
      />
    </IonPage>
  );
};

export default NewSessionPage;
