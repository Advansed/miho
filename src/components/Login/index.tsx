import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from '@ionic/react';
import React from 'react';
import { Authorization } from './authorization';
import { Registration } from './registration';
import { Restore } from './restore';
import { LoginMode, useLogin } from './useLogin';
import styles from './Login.module.css';

interface LoginProps {
  initialMode?: LoginMode;
}

export const Login: React.FC<LoginProps> = ({ initialMode = 'authorization' }) => {
  const {
    state,
    setMode,
    setPhone,
    setPassword,
    setEmail,
    setName,
    setPincode,
    setRegistrationStep,
    login,
    requestRegisterCode,
    verifyRegisterCode,
    register,
    restore,
  } = useLogin(initialMode);

  const handleSubmit = async () => {
    if (state.mode === 'authorization') {
      await login({ phone: state.phone, password: state.password });
    } else if (state.mode === 'registration') {
      if (state.registrationStep === 'phone') {
        await requestRegisterCode(state.phone);
      } else if (state.registrationStep === 'code') {
        await verifyRegisterCode({ phone: state.phone, pincode: state.pincode });
      } else {
        await register({
          phone: state.phone,
          pincode: state.pincode,
          password: state.password,
          name: state.name,
          email: state.email,
        });
        setRegistrationStep('phone');
      }
    } else if (state.mode === 'restore') {
      await restore({ phone: state.phone, pincode: '', password: state.password });
    }
  };

  const renderForm = () => {
    switch (state.mode) {
      case 'authorization':
        return (
          <Authorization
            phone={state.phone}
            password={state.password}
            onPhoneChange={setPhone}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        );
      case 'registration':
        return (
          <Registration
            step={state.registrationStep}
            phone={state.phone}
            pincode={state.pincode}
            password={state.password}
            name={state.name}
            email={state.email}
            onPhoneChange={setPhone}
            onPincodeChange={setPincode}
            onPasswordChange={setPassword}
            onNameChange={setName}
            onEmailChange={setEmail}
            onRequestCode={() => handleSubmit()}
            onVerifyCode={() => handleSubmit()}
            onSubmit={handleSubmit}
          />
        );
      case 'restore':
        return (
          <Restore
            phone={state.phone}
            onPhoneChange={setPhone}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <IonCard className={styles.loginCard}>
      <IonCardHeader>
        <IonCardTitle className={styles.title}>Аккаунт</IonCardTitle>
        <IonText color="medium">
          <p className={styles.subtitle}>
            Войдите, зарегистрируйтесь или восстановите доступ
          </p>
        </IonText>
      </IonCardHeader>
      <IonCardContent>
        <div className={styles.modeSwitch}>
          <IonButton
            fill={state.mode === 'authorization' ? 'solid' : 'outline'}
            size="small"
            className={
              state.mode === 'authorization'
                ? styles.modeButtonActive
                : styles.modeButton
            }
            onClick={() => {
              setMode('authorization');
            }}
          >
            Вход
          </IonButton>
          <IonButton
            fill={state.mode === 'registration' ? 'solid' : 'outline'}
            size="small"
            className={
              state.mode === 'registration'
                ? styles.modeButtonActive
                : styles.modeButton
            }
            onClick={() => {
              setMode('registration');
              setRegistrationStep('phone');
              setPincode('');
            }}
          >
            Регистрация
          </IonButton>
        </div>

        <div className={styles.formWrapper}>
          {renderForm()}
        </div>

        {state.mode !== 'restore' && (
          <IonButtons style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
            <IonButton
              fill="clear"
              size="small"
              onClick={() => setMode('restore')}
            >
              Забыли пароль?
            </IonButton>
          </IonButtons>
        )}
      </IonCardContent>
    </IonCard>
  );
};


