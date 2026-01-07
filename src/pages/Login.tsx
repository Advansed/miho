import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Login } from '../components/Login';

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Вход в аккаунт</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <Login />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;


