import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import React from 'react';

interface RestoreProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit?: () => void;
}

export const Restore: React.FC<RestoreProps> = ({
  phone,
  onPhoneChange,
  onSubmit,
}) => {
  return (
    <>
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Телефон</IonLabel>
          <IonInput
            type="tel"
            value={phone}
            onIonChange={(e) => onPhoneChange(e.detail.value ?? '')}
            placeholder="Введите телефон для восстановления"
          />
        </IonItem>
      </IonList>
      <IonButton expand="block" onClick={onSubmit}>
        Восстановить доступ
      </IonButton>
    </>
  );
};


