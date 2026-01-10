// StepperHeader.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBackOutline, addCircleOutline, arrowForwardOutline } from 'ionicons/icons';
import styles from './Styles.module.css';

interface StepperHeaderProps {
  currentStep: 1 | 2 | 3;
  totalSteps: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
}

const StepperHeader: React.FC<StepperHeaderProps> = ({
  currentStep,
  totalSteps,
  isLoading,
  onPrev,
  onNext,
  onSave
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={styles.stepsHeader}>
      {/* Левая кнопка назад */}
      <div className={styles.stepsLeft}>
        <IonButton
          type="button"
          color="medium"
          onClick={onPrev}
          disabled={isLoading}
          className={styles.cancelButton}
        >
            <IonIcon icon = { arrowBackOutline } />
        </IonButton>
      </div>

      {/* Сам индикатор шагов по центру */}
      <div className={styles.stepsProgress}>
        <div
          className={`${styles.stepDot} ${
            currentStep >= 1 ? styles.stepDotActive : ''
          }`}
        >
          {currentStep > 1 ? <IonIcon icon={addCircleOutline} /> : '1'}
        </div>
        <div className={styles.stepLine} />
        <div
          className={`${styles.stepDot} ${
            currentStep >= 2 ? styles.stepDotActive : ''
          }`}
        >
          {currentStep > 2 ? <IonIcon icon={addCircleOutline} /> : '2'}
        </div>
        <div className={styles.stepLine} />
        <div
          className={`${styles.stepDot} ${
            currentStep >= 3 ? styles.stepDotActive : ''
          }`}
        >
          3
        </div>
      </div>

      {/* Правая кнопка: далее / сохранить */}
      <div className={styles.stepsRight}>
        {!isLastStep && (
          <IonButton
            type="button"
            color="primary"
            disabled={isLoading}
            className={styles.submitButton}
            onClick={onNext}
          >
            <IonIcon icon = { arrowForwardOutline } />
          </IonButton>
        )}

        {isLastStep && (
          <IonButton
            type="button"
            color="primary"
            disabled={isLoading}
            className={styles.submitButton}
            onClick={onSave}
          >
            Сохранить
          </IonButton>
        )}
      </div>
    </div>
  );
};

export default StepperHeader;
