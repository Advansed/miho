import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact, useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import Page from './pages/Page';
import Home from './pages/Home';
import LoginPage from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { ToastProvider } from './components/Toast';
import { useToken } from './components/Login/LoginStore';
import { useEffect, useState } from 'react';

setupIonicReact();

const DefApp: React.FC = () => {
  return (
    <IonApp>
      <ToastProvider>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Home />
              </Route>
              <Route path="/login" exact={true}>
                <LoginPage />
              </Route>
              <Route path="/folder/:name" exact={true}>
                <Page />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </ToastProvider>
    </IonApp>
  );
};

const App: React.FC = () => {
  const { token } = useToken()
  
  if( token )
    return (
      <IonApp>
        <ToastProvider>
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <IonRouterOutlet id="main">
                <Route path="/" exact={true}>
                  <Page />
                </Route>
                <Route path="/login" exact={true}>
                  <Page />
                </Route>
                <Route path="/folder/:name" exact={true}>
                  <Page />
                </Route>
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter>
        </ToastProvider>
      </IonApp>
    )
  else return <DefApp />
};

export default App;
