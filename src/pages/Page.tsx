import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { UserForm } from '../components/User';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  console.log('page', name)

  return (
    <IonPage>
      <IonContent fullscreen>
        <UserForm />
      </IonContent>
    </IonPage>
  );
};

export default Page;
