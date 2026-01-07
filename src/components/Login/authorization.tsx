import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import React from 'react';

interface AuthorizationProps {
  phone: string;
  password: string;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit?: () => void;
}

export const Authorization: React.FC<AuthorizationProps> = ({
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
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
            placeholder="Введите номер телефона"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Пароль</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => onPasswordChange(e.detail.value ?? '')}
            placeholder="Введите пароль"
          />
        </IonItem>
      </IonList>
      <IonButton expand="block" onClick={onSubmit}>
        Войти
      </IonButton>
    </>
  );
};


