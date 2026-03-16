// index.tsx
import React, { useState } from 'react';
import UserDashboard from './components/Dashboard';
import AddSessionModal from './components/NewSession';
import EditSession from './components/EditSession';
import { useSession } from './useSession';
import { useToken } from '../Login/LoginStore';

export const UserForm: React.FC = () => {
  const [page, setPage] = useState<'main' | 'new' | 'edit'>('main');
  const [editSessionId, setEditSessionId] = useState<number | null>(null);
  const { token } = useToken();
  const { set_session, del_session, upd_session, session, sessions, loading } = useSession();

  const main = () => {
    return (
      <UserDashboard
        onNew         = { async () => setPage('new')}
        onOpenSession = { (session) => {
          set_session( session )
          setPage('edit');
        }}
      />
    )
  }

  const nova = () => {
    return (
      <AddSessionModal
        onSubmit={async (data) => {
          await upd_session( data );
          setPage('main');
        }}
        onClose={() => setPage('main')}
        isLoading={loading}
      />
    )
  }

  const edit = () => {
    if (!session) return null;
    return (
      <EditSession
        session = { session }
        onClose={() => {
          setPage('main');
          setEditSessionId(null);
        }}
        onCancel={async () => {
          if (session) {
            await del_session(session.id);
          }
        }}
        onSave={async (data) => {
          await upd_session( data );
        }}
        isLoading={loading}
      />
    )
  }

  const renderForm = () => {
    switch (page) {
      case 'main':  return main()
      case 'new':   return nova()
      case 'edit':  return session ? edit() : main()
      default: return <></>;
    }
  };

  return renderForm();
};

// Или оборачиваем в React.memo для предотвращения лишних рендеров
export default React.memo(UserForm);