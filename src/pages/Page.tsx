import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './Page.css';
import { UserForm } from '../components/User';
import { OperatorForm } from '../components/Operator';
import { PhotographerForm } from '../components/Photographer';
import { useLoginStore } from '../components/Login/LoginStore';

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const role = useLoginStore((s) => s.role);

  return (
    <IonPage>
      <IonContent fullscreen>
        {role === 'operator' ? (
          <OperatorForm />
        ) : role === 'photographer' ? (
          <PhotographerForm />
        ) : (
          <UserForm />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Page;
