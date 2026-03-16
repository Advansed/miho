import React, { useState } from 'react';
import PhotographerDashboard from './components/Dashboard';
import ViewSession from './components/ViewSession';
import SessionUpload from './components/SessionUpload';
import { useSession } from '../User/useSession';
import { Session } from '../Store/sessionStore';

export const PhotographerForm: React.FC = () => {
  const [page, setPage] = useState<'main' | 'view' | 'session'>('main');
  const { session, set_session } = useSession();

  const view = () => {
    if (!session) return main();
    return (
      <ViewSession
        session={session}
        onClose={() => {
          set_session(null);
          setPage('main');
        }}
        onStartSession={() => setPage('session')}
      />
    );
  };

  const sessionUpload = () => {
    if (!session) return main();
    return (
      <SessionUpload
        session={session}
        onClose={() => {
          set_session(null);
          setPage('main');
        }}
      />
    );
  };

  const main = () => {
    return (
      <PhotographerDashboard
        onOpenRequest={(request: Session) => {
          set_session(request);
          setPage('view');
        }}
      />
    );
  };

  switch (page) {
    case 'view':
      return view();
    case 'session':
      return sessionUpload();
    default:
      return main();
  }
};

export default PhotographerForm;
