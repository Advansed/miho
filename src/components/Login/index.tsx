import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLoading,
  IonText,
} from '@ionic/react';
import React from 'react';
import { Authorization } from './authorization';
import { Registration } from './registration';
import { Restore } from './restore';
import { LoginMode, useLogin } from './useLogin';
import styles from './Styles.module.css'; // Изменено на Styles.module.css
import { useAuth } from './LoginStore';

interface LoginProps {
  initialMode?: LoginMode;
}

export const Login: React.FC<LoginProps> = ({ initialMode = 'authorization' }) => {
  const {
    state,
    setMode,
    setPhone,
    setPassword,
    setConfirm,
    setEmail,
    setName,
    setPincode,
    setRegistrationStep,
    login,
    requestRegisterCode,
    verifyRegisterCode,
    register,
    restore,
    loading,
  } = useLogin(initialMode);

  const { setAuth } = useAuth()

  const handleSubmit = async () => {
    console.log("submit", state);
    if (state.mode === 'authorization') {
      await login({ phone: state.phone, password: state.password });
    } else if (state.mode === 'registration') {
      if (state.registrationStep === 'phone') {
        await requestRegisterCode(state.phone);
      } else if (state.registrationStep === 'code') {
        await verifyRegisterCode({ phone: state.phone, pincode: state.pincode });
      } else {
        await register({
          phone:    state.phone,
          password: state.password,
          name:     state.name,
          email:    state.email,
        });

        setAuth(true)
        
        setRegistrationStep('phone');
      }
    } else if (state.mode === 'restore') {
      await restore({ phone: state.phone, pincode: '', password: state.password });
    }
  };

  const handleRestoreSubmit = async () => {
      
    if (state.registrationStep === 'phone') {
      await requestRegisterCode(state.phone, true);
    } else if (state.registrationStep === 'code') {
      await verifyRegisterCode({ phone: state.phone, pincode: state.pincode });
    } else {
      await register({
          phone:    state.phone,
          password: state.password
        });
        setRegistrationStep('phone');
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
            step                    = { state.registrationStep }
            phone                   = { state.phone }
            pincode                 = { state.pincode }
            password                = { state.password }
            confirmPassword         = { state.confirmPassword }
            name                    = { state.name }
            email                   = { state.email }
            onPhoneChange           = { setPhone }
            onPincodeChange         = { setPincode }
            onPasswordChange        = { setPassword }
            onNameChange            = { setName }
            onEmailChange           = { setEmail }
            onRequestCode           = { () => handleSubmit() }
            onVerifyCode            = { () => handleSubmit() }
            onConfirmPasswordChange = { setConfirm }
            onSubmit                = { handleSubmit }
          />
        );
      // В switch-case для restore:
      case 'restore':
        return (
          <Restore
            step                    ={state.registrationStep}
            phone                   ={state.phone}
            pincode                 ={state.pincode}
            password                ={state.password}
            confirmPassword         ={state.confirmPassword}
            onPhoneChange           ={setPhone}
            onPincodeChange         ={setPincode}
            onPasswordChange        ={setPassword}
            onConfirmPasswordChange ={setConfirm}
            onRequestCode           ={() => handleRestoreSubmit()}
            onVerifyCode            ={() => handleRestoreSubmit()}
            onSubmit                ={handleRestoreSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <IonCard className={styles.card}>
        <IonCardHeader>
          <IonCardTitle className={styles.title}>Аккаунт</IonCardTitle>
          <IonText color="medium">
            <p style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              fontSize: '14px', 
              marginTop: '8px' 
            }}>
              Войдите, зарегистрируйтесь или восстановите доступ
            </p>
          </IonText>
        </IonCardHeader>
        <IonLoading isOpen={loading} message="Подождите" />
        <IonCardContent>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            marginBottom: '24px' 
          }}>
            <IonButton
              fill={state.mode === 'authorization' ? 'solid' : 'outline'}
              size="small"
              style={{
                '--background': state.mode === 'authorization' 
                  ? 'linear-gradient(135deg, #2563eb, #4f46e5)' 
                  : 'transparent',
                '--color': state.mode === 'authorization' 
                  ? '#f9fafb' 
                  : '#9ca3af',
                '--border-color': '#6b7280',
                '--border-radius': '999px',
                '--padding-top': '10px',
                '--padding-bottom': '10px',
                '--padding-start': '20px',
                '--padding-end': '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onClick={() => {
                setMode('authorization');
              }}
            >
              Вход
            </IonButton>
            <IonButton
              fill={state.mode === 'registration' ? 'solid' : 'outline'}
              size="small"
              style={{
                '--background': state.mode === 'registration' 
                  ? 'linear-gradient(135deg, #2563eb, #4f46e5)' 
                  : 'transparent',
                '--color': state.mode === 'registration' 
                  ? '#f9fafb' 
                  : '#9ca3af',
                '--border-color': '#6b7280',
                '--border-radius': '999px',
                '--padding-top': '10px',
                '--padding-bottom': '10px',
                '--padding-start': '20px',
                '--padding-end': '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onClick={() => {
                setMode('registration');
                setRegistrationStep('phone');
                setPincode('');
              }}
            >
              Регистрация
            </IonButton>
          </div>

          <div>
            {renderForm()}
          </div>

          {state.mode !== 'restore' && (
            <IonButtons style={{ 
              marginTop: '1rem', 
              justifyContent: 'flex-end' 
            }}>
              <IonButton
                fill="clear"
                size="small"
                style={{
                  '--color': '#9ca3af',
                  fontSize: '14px'
                }}
                onClick={() => setMode('restore')}
              >
                Забыли пароль?
              </IonButton>
            </IonButtons>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};