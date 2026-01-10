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
  IonDatetime,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonNote,
  IonRow,
  IonCol,
  IonGrid,
  IonAlert,
  IonSpinner
} from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  cashOutline,
  addCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import styles from './Styles.module.css';
import StepperHeader from './StepperHeader';

interface NewSessionPageProps {
  onSubmit: (sessionData: NewSessionData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export interface NewSessionData {
  sessionType: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  amount: number;
  isPaid: boolean;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

const SESSION_TYPES = [
  'Свадебная фотосессия',
  'Портретная съемка',
  'Семейная фотосессия',
  'Love Story',
  'Корпоративная съемка',
  'Индивидуальный портрет',
  'Детская фотосессия',
  'Предметная съемка',
  'Мероприятие',
  'Другое'
];

const NewSessionPage: React.FC<NewSessionPageProps> = ({
  onSubmit,
  onClose,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<NewSessionData>({
    sessionType: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    amount: 0,
    isPaid: false,
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  // Три шага вместо двух
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const validateStep = (step: 1 | 2 | 3): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.sessionType.trim()) {
        newErrors.sessionType = 'Выберите тип фотосессии';
      }
      if (!formData.date) {
        newErrors.date = 'Выберите дату съемки';
      }
      if (!formData.time) {
        newErrors.time = 'Выберите время съемки';
      }
    }

    if (step === 2) {
      if (formData.amount <= 0) {
        newErrors.amount = 'Введите корректную сумму';
      }
    }

    if (step === 3) {
      if (
        !formData.clientName?.trim() &&
        !formData.clientPhone?.trim() &&
        !formData.clientEmail?.trim()
      ) {
        newErrors.clientInfo =
          'Заполните хотя бы одно поле контактов клиента';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    return validateStep(1) && validateStep(2) && validateStep(3);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setCurrentStep(1);
      return;
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    await onSubmit({
      ...formData,
      date: dateTime.toISOString().split('T')[0]
    });

    if (!isLoading) {
      resetForm();
      if (onClose) onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      sessionType: '',
      date: '',
      time: '',
      location: '',
      notes: '',
      amount: 0,
      isPaid: false,
      clientName: '',
      clientPhone: '',
      clientEmail: ''
    });
    setErrors({});
    setCurrentStep(1);
  };

  const TOTAL_STEPS: 3 = 3;
  
  const handleInputChange = (field: keyof NewSessionData, value: any) => {
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
    if (field === 'clientName' || field === 'clientPhone' || field === 'clientEmail') {
      if (errors.clientInfo) {
        setErrors(prev => ({
          ...prev,
          clientInfo: ''
        }));
      }
    }
    if (field === 'amount') {
      if (errors.amount) {
        setErrors(prev => ({
          ...prev,
          amount: ''
        }));
      }
    }
  };

  const handleBack = () => {
    const hasChanges = Object.values(formData).some(
      (value, index) =>
        index > 0 &&
        (typeof value === 'string'
          ? value.trim() !== ''
          : typeof value === 'number'
          ? value !== 0
          : value !== false)
    );

    if (hasChanges) {
      setShowConfirmLeave(true);
    } else {
      onClose();
    }
  };

  const handleForceBack = () => {
    resetForm();
  };

  const formatDateTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return '';

    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleTimeChange = (value: string | null | undefined) => {
    if (!value) {
      return;
    }

    const iso = value.toString();
    const timePart = iso.split('T')[1];

    if (!timePart) return;

    const hhmm = timePart.slice(0, 5);
    handleInputChange('time', hhmm);
  };

  const goNextStep = () => {
    if (currentStep === 1) {
      if (validateStep(1)) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep(2)) {
        setCurrentStep(3);
      }
    }
  };

  const goPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      handleBack();
    }
  };

  const getStepProgress = () => {
    return `${currentStep} / 3`;
  };

  const handleSaveClick = () => {
    // на последнем шаге «Сохранить» = отправка формы
    handleSubmit();
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
          <IonButtons slot="end">
            <span className={styles.stepIndicator}>{getStepProgress()}</span>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* scrollY отключен */}
      <IonContent className={styles.pageContent} scrollY={false}>
        <div className={styles.pageContainer}>
          <div className={styles.pageCard}>

             <StepperHeader
                currentStep   = { currentStep }
                totalSteps    = { TOTAL_STEPS }
                isLoading     = { isLoading }
                onPrev        = { goPrevStep }
                onNext        = { goNextStep }
                onSave        = { handleSaveClick }
            />


            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* ===== STEP 1: Детали фотосессии ===== */}
              {currentStep === 1 && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <IonIcon
                      icon={cameraOutline}
                      className={styles.sectionIcon}
                    />
                    Детали фотосессии
                  </h3>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">
                      Тип фотосессии{' '}
                      <span className={styles.required}>*</span>
                    </IonLabel>
                    <IonSelect
                      value={formData.sessionType}
                      placeholder="Выберите тип"
                      onIonChange={e =>
                        handleInputChange(
                          'sessionType',
                          e.detail.value
                        )
                      }
                      disabled={isLoading}
                      className={
                        errors.sessionType ? styles.inputError : ''
                      }
                    >
                      {SESSION_TYPES.map(type => (
                        <IonSelectOption key={type} value={type}>
                          {type}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                    {errors.sessionType && (
                      <IonNote slot="error" color="danger">
                        {errors.sessionType}
                      </IonNote>
                    )}
                  </IonItem>

                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem
                          className={styles.formItem}
                          lines="full"
                        >
                          <IonLabel position="stacked">
                            Дата съемки{' '}
                            <span className={styles.required}>*</span>
                          </IonLabel>
                          <IonInput
                            type  = "date"
                            value ={formData.date}
                            min   ={getTodayDate()}
                            onIonChange={e =>
                              handleInputChange(
                                'date',
                                (e.detail.value as string).split(
                                  'T'
                                )[0]
                              )
                            }
                            disabled={isLoading}
                            className={
                              errors.date ? styles.inputError : ''
                            }
                          >
                            <IonIcon
                              slot="start"
                              icon={calendarOutline}
                            />
                          </IonInput>
                          {errors.date && (
                            <IonNote slot="error" color="danger">
                              {errors.date}
                            </IonNote>
                          )}
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem
                          className={styles.formItem}
                          lines="full"
                        >
                          <IonLabel position="stacked">
                            Время съемки{' '}
                            <span className={styles.required}>*</span>
                          </IonLabel>
                          <IonInput
                            type="time"
                            value={
                              formData.time
                                ? `2025-01-01T${formData.time}`
                                : undefined
                            }
                            onIonChange={e =>
                              handleTimeChange(
                                e.detail.value as string
                              )
                            }
                            disabled={isLoading}
                            className={
                              errors.time ? styles.inputError : ''
                            }
                          />
                          {errors.time && (
                            <IonNote slot="error" color="danger">
                              {errors.time}
                            </IonNote>
                          )}
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">
                      Локация (если известна)
                    </IonLabel>
                    <IonInput
                      value={formData.location}
                      placeholder="Например: Парк Горького, студия Light..."
                      onIonChange={e =>
                        handleInputChange('location', e.detail.value)
                      }
                      disabled={isLoading}
                    >
                      <IonIcon
                        slot="start"
                        icon={locationOutline}
                      />
                    </IonInput>
                  </IonItem>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">
                      Дополнительные заметки
                    </IonLabel>
                    <IonTextarea
                      value={formData.notes}
                      placeholder="Особые пожелания, детали съемки..."
                      rows={3}
                      onIonChange={e =>
                        handleInputChange('notes', e.detail.value)
                      }
                      disabled={isLoading}
                    />
                  </IonItem>
                </div>
              )}

              {/* ===== STEP 2: Стоимость и статус оплаты ===== */}
              {currentStep === 2 && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <IonIcon
                      icon={cashOutline}
                      className={styles.sectionIcon}
                    />
                    Стоимость и статус оплаты
                  </h3>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">
                      Сумма (руб.){' '}
                      <span className={styles.required}>*</span>
                    </IonLabel>
                    <IonInput
                      type="number"
                      value={formData.amount}
                      placeholder="Введите сумму"
                      onIonChange={e =>
                        handleInputChange(
                          'amount',
                          parseFloat(e.detail.value || '0')
                        )
                      }
                      disabled={isLoading}
                      className={
                        errors.amount ? styles.inputError : ''
                      }
                    >
                      <IonIcon slot="start" icon={cashOutline} />
                    </IonInput>
                    {errors.amount && (
                      <IonNote slot="error" color="danger">
                        {errors.amount}
                      </IonNote>
                    )}
                  </IonItem>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel>Оплачено</IonLabel>
                    <IonToggle
                      slot="end"
                      checked={formData.isPaid}
                      onIonChange={e =>
                        handleInputChange('isPaid', e.detail.checked)
                      }
                      disabled={isLoading}
                    />
                  </IonItem>

                  {/* Превью текущих данных */}
                  {formData.date && formData.time && (
                    <div className={styles.previewSection}>
                      <h4>Текущие данные:</h4>
                      <p>
                        <strong>
                          {formData.sessionType || 'Тип не выбран'}
                        </strong>
                        <br />
                        {formatDateTime(
                          formData.date,
                          formData.time
                        )}
                        <br />
                        {formData.location &&
                          `📍 ${formData.location}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== STEP 3: Контактная информация ===== */}
              {currentStep === 3 && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Контактная информация клиента
                  </h3>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">Имя клиента</IonLabel>
                    <IonInput
                      value={formData.clientName}
                      placeholder="Введите имя"
                      onIonChange={e =>
                        handleInputChange('clientName', e.detail.value)
                      }
                      disabled={isLoading}
                    />
                  </IonItem>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">Телефон</IonLabel>
                    <IonInput
                      type="tel"
                      value={formData.clientPhone}
                      placeholder="+7 (999) 123-45-67"
                      onIonChange={e =>
                        handleInputChange(
                          'clientPhone',
                          e.detail.value
                        )
                      }
                      disabled={isLoading}
                    />
                  </IonItem>

                  <IonItem className={styles.formItem} lines="full">
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                      type="email"
                      value={formData.clientEmail}
                      placeholder="client@example.com"
                      onIonChange={e =>
                        handleInputChange(
                          'clientEmail',
                          e.detail.value
                        )
                      }
                      disabled={isLoading}
                    />
                  </IonItem>

                  {errors.clientInfo && (
                    <IonNote
                      color="danger"
                      className={styles.errorNote}
                    >
                      {errors.clientInfo}
                    </IonNote>
                  )}

                  {/* Полный предпросмотр ===== */}
                  {formData.date && formData.time && (
                    <div className={styles.previewSection}>
                      <h4>Полный предпросмотр:</h4>
                      <div className={styles.previewContent}>
                        <p>
                          <strong>
                            {formData.sessionType || 'Тип не выбран'}
                          </strong>
                        </p>
                        <p>
                          📅{' '}
                          {formatDateTime(
                            formData.date,
                            formData.time
                          )}
                        </p>
                        {formData.location && (
                          <p>📍 {formData.location}</p>
                        )}
                        {formData.notes && (
                          <p>📝 {formData.notes}</p>
                        )}
                        <hr />
                        <p>
                          💰 <strong>{formData.amount} ₽</strong>
                          {formData.isPaid && (
                            <span style={{ marginLeft: '8px' }}>
                              ✅ Оплачено
                            </span>
                          )}
                        </p>
                        {(formData.clientName ||
                          formData.clientPhone ||
                          formData.clientEmail) && (
                          <>
                            <hr />
                            {formData.clientName && (
                              <p>👤 {formData.clientName}</p>
                            )}
                            {formData.clientPhone && (
                              <p>📞 {formData.clientPhone}</p>
                            )}
                            {formData.clientEmail && (
                              <p>✉️ {formData.clientEmail}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== NAVIGATION BUTTONS ===== */}
              <div className={styles.formActions}>
                <IonButton
                  type="button"
                  expand="block"
                  color="medium"
                  onClick={goPrevStep}
                  disabled={isLoading}
                  className={styles.cancelButton}
                >
                  {currentStep === 1 ? 'Отмена' : 'Назад'}
                </IonButton>

                {currentStep < 3 && (
                  <IonButton
                    type="button"
                    expand="block"
                    color="primary"
                    disabled={isLoading}
                    className={styles.submitButton}
                    onClick={goNextStep}
                  >
                    Далее
                  </IonButton>
                )}

                {currentStep === 3 && (
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
                        <span style={{ marginLeft: '8px' }}>
                          Создание...
                        </span>
                      </>
                    ) : (
                      <>
                        <IonIcon
                          icon={addCircleOutline}
                          slot="start"
                        />
                        Создать фотосессию
                      </>
                    )}
                  </IonButton>
                )}
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
