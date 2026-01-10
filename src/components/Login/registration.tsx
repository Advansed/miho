import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import styles from './Styles.module.css';
import { SMSInput } from '../SMSInput';
import { PhoneInput } from '../PhoneInput';
import { useToast } from '../Toast';

type RegistrationStep = 'phone' | 'code' | 'profile';

interface RegistrationProps {
  step: RegistrationStep;
  phone: string;
  pincode: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  onPhoneChange: (value: string) => void;
  onPincodeChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
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
  confirmPassword,
  name,
  email,
  onPhoneChange,
  onPincodeChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onNameChange,
  onEmailChange,
  onRequestCode,
  onVerifyCode,
  onSubmit,
}) => {
  // Автофокус на SMS инпут при переходе на шаг code
  const [autoFocus, setAutoFocus] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (step === 'code') {
      setAutoFocus(true);
      setTimeout(() => {
        setAutoFocus(false);
      }, 300);
    }
  }, [step]);

  const handleSmsCodeChange = (value: string) => {
    onPincodeChange(value);
  };

  // Форматируем телефон для отображения
  const formatPhone = (value: string): string => {
    // Удаляем все нецифровые символы
    let digits = value.replace(/\D/g, '');
    
    // Если первый символ 8, меняем на 7
    if (digits.startsWith('8')) {
      digits = '7' + digits.substring(1);
    }
    
    // Ограничиваем длину (11 цифр с кодом страны)
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }
    
    // Форматируем в маске
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    
    if (digits.length > 1) {
      formatted += ` (${digits.substring(1, 4)}`;
    }
    if (digits.length > 4) {
      formatted += `) ${digits.substring(4, 7)}`;
    }
    if (digits.length > 7) {
      formatted += `-${digits.substring(7, 9)}`;
    }
    if (digits.length > 9) {
      formatted += `-${digits.substring(9, 11)}`;
    }
    
    return formatted;
  };

  // Проверка совпадения паролей
  const isPasswordValid = () => {
    console.log( password, confirmPassword)
    return password === confirmPassword && password.length > 0;
  };

  const renderStep = () => {
    if (step === 'phone') {
      return (
        <>
          <IonList className={styles.list}>
            <IonItem className={styles.item}>
              <IonLabel position="stacked" className={styles.label}>
                Телефон
              </IonLabel>
              <div style={{ 
                width: '100%', 
                padding: '8px 0' 
              }}>
                <PhoneInput
                  value={phone}
                  onChange={onPhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>
            </IonItem>
          </IonList>
          <IonButton 
            expand="block" 
            onClick={onRequestCode} 
            className={styles.button}
            disabled={!phone || phone.length < 11}
          >
            Получить СМС
          </IonButton>
        </>
      );
    }

    if (step === 'code') {
      return (
        <>
          <IonList className={styles.list}>
            <IonItem className={styles.item}>
              <IonLabel position="stacked" className={styles.label}>
                Телефон
              </IonLabel>
              <div style={{ 
                padding: '8px 0', 
                color: '#e5e7eb', 
                fontSize: '15px',
                opacity: 0.7
              }}>
                {formatPhone(phone)}
              </div>
            </IonItem>
            <IonItem className={styles.item}>
              <IonLabel position="stacked" className={styles.label}>
                Код из СМС
              </IonLabel>
              <SMSInput
                value={pincode}
                onChange={handleSmsCodeChange}
                length={4}
              />
            </IonItem>
          </IonList>
          <IonButton 
            expand="block" 
            onClick={onVerifyCode} 
            className={styles.button}
            disabled={!pincode || pincode.length !== 4}
          >
            Проверить код
          </IonButton>
          <IonText color="medium">
            <p style={{ 
              textAlign: 'center', 
              marginTop: '0.75rem',
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              Проверьте СМС на указанном номере
            </p>
          </IonText>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            color: '#6b7280',
            fontSize: '13px'
          }}>
            <p>Не пришел код? <span style={{ 
              color: '#3b82f6', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }} onClick={onRequestCode}>
              Отправить повторно
            </span></p>
          </div>
        </>
      );
    }

    return (
      <>
        <IonList className={styles.list}>
          <IonItem className={styles.item}>
            <IonLabel position="stacked" className={styles.label}>
              Имя
            </IonLabel>
            <IonInput
              type="text"
              value={name}
              onIonChange={(e) => onNameChange(e.detail.value ?? '')}
              placeholder="Введите имя"
              className={styles.input}
            />
          </IonItem>
          <IonItem className={styles.item}>
            <IonLabel position="stacked" className={styles.label}>
              Эл. почта
            </IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => onEmailChange(e.detail.value ?? '')}
              placeholder="Введите email"
              className={styles.input}
            />
          </IonItem>
          <IonItem className={styles.item}>
            <IonLabel position="stacked" className={styles.label}>
              Пароль
            </IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => onPasswordChange(e.detail.value ?? '')}
              placeholder="Придумайте пароль"
              className={styles.input}
            />
          </IonItem>
          <IonItem className={styles.item}>
            <IonLabel position="stacked" className={styles.label}>
              Подтвердите пароль
            </IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e) => onConfirmPasswordChange(e.detail.value ?? '')}
              placeholder="Повторите пароль"
              className={styles.input}
            />
          </IonItem>
          {confirmPassword && !isPasswordValid() && (
            <IonText color="danger" style={{ 
              fontSize: '12px', 
              marginTop: '4px',
              paddingLeft: '16px'
            }}>
              Пароли не совпадают
            </IonText>
          )}
        </IonList>
        <IonButton 
          expand="block" 
          onClick={() =>{
            if(!name){
              toast.error("Заполните Имя")
            } else 
            if(!isPasswordValid()) {
              toast.error("Пароли не совпадают")
            } else 
            if( onSubmit) onSubmit()
          }} 
          className={styles.button}
          // disabled={!name || !email || !password || !confirmPassword }
        >
          Завершить регистрацию
        </IonButton>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {step === 'phone' ? 'Регистрация' : 
           step === 'code' ? 'Подтверждение' : 
           'Данные профиля'}
        </h1>
        {renderStep()}
      </div>
    </div>
  );
};