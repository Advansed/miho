import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import React from 'react';
import styles from './Styles.module.css';
import { PhoneInput } from '../PhoneInput';

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

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
                placeholder="+7 ___ ___-__-__"
                required
              />
            </div>
          </IonItem>

          <IonItem className={styles.item}>
            <IonLabel position="stacked" className={styles.label}>
              Пароль
            </IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => onPasswordChange(e.detail.value ?? '')}
              placeholder="Введите пароль"
              className={styles.input}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          onClick={onSubmit}
          className={styles.button}
          disabled={!phone || !password}
        >
          Войти
        </IonButton>
      </div>
    </div>
  );
};