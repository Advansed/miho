import React, { useState } from 'react';
import OperatorDashboard from './components/Dashboard';
import EditRequest from './components/EditRequest';
import { useSession } from '../User/useSession';
import { Session } from '../Store/sessionStore';

export const OperatorForm: React.FC = () => {
  const [page, setPage] = useState<'main' | 'edit'>('main');
  const { upd_session, loading, session, set_session } = useSession();

  const edit = () => {
    if(!session) return main()
    else return (
      <EditRequest
          request={session}
          onClose={() => {
            setPage('main');
            set_session( null );
          }}
          onSave={async (id, data) => {
            await upd_session({
              id:         id,
              date:       data.date,
              time:       data.time,
              location:   data.location,
              type:       data.type,
              photographer_id: data.photographer_id,
              status:     data.status,
              amount:     data.amount,
            });
          }}
          isLoading={loading}
        />
      )
  }

  const main = () => {
    return (
      <OperatorDashboard
        onOpenRequest={(request: Session) => {
          set_session(request);
          setPage('edit');
        }}
      />
    );
  }

  switch( page ) {
    case "edit" :  return edit()
    default : return main()
  }

};

export default OperatorForm;
