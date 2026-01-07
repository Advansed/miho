import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/react';
import React from 'react';

type RegistrationStep = 'phone' | 'code' | 'profile';

interface RegistrationProps {
  step: RegistrationStep;
  phone: string;
  pincode: string;
  password: string;
  name: string;
  email: string;
  onPhoneChange: (value: string) => void;
  onPincodeChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRequestCode: () => void;
  onVerifyCode: () => void;
  onSubmit?: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({
  step,
  phone,
  pincode,
  password,
  name,
  email,
  onPhoneChange,
  onPincodeChange,
  onPasswordChange,
  onNameChange,
  onEmailChange,
  onRequestCode,
  onVerifyCode,
  onSubmit,
}) => {
  const renderStep = () => {
    if (step === 'phone') {
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
          </IonList>
          <IonButton expand="block" onClick={onRequestCode}>
            Получить СМС
          </IonButton>
        </>
      );
    }

    if (step === 'code') {
      return (
        <>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Телефон</IonLabel>
              <IonInput value={phone} disabled />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Код из СМС</IonLabel>
              <IonInput
                type="text"
                value={pincode}
                onIonChange={(e) => onPincodeChange(e.detail.value ?? '')}
                placeholder="Введите код"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Пароль</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => onPasswordChange(e.detail.value ?? '')}
                placeholder="Придумайте пароль"
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={onVerifyCode}>
            Продолжить
          </IonButton>
          <IonText color="medium">
            <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              Проверьте СМС на указанном номере
            </p>
          </IonText>
        </>
      );
    }

    return (
      <>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Имя</IonLabel>
            <IonInput
              type="text"
              value={name}
              onIonChange={(e) => onNameChange(e.detail.value ?? '')}
              placeholder="Введите имя"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Эл. почта</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => onEmailChange(e.detail.value ?? '')}
              placeholder="Введите email"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Пароль</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => onPasswordChange(e.detail.value ?? '')}
              placeholder="Придумайте пароль"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Код из СМС</IonLabel>
            <IonInput
              type="text"
              value={pincode}
              onIonChange={(e) => onPincodeChange(e.detail.value ?? '')}
              placeholder="Введите код"
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={onSubmit}>
          Завершить регистрацию
        </IonButton>
      </>
    );
  };

  return renderStep();
};



