// UserStore.ts
import { create } from 'zustand';

export type SessionStatus = 'planned' | 'pending_payment' | 'completed' | 'in_progress' | 'draft';

export interface Session {
  id:               string;
  date:             string; // 'YYYY-MM-DD'
  time:             string; // 'HH-mm-ss'
  type:             string;
  location?:        string;
  status:           string;
  photographer_id:  string;
  isPaid:           boolean;
  amount:           number;
  name:             string;
  email:            string;
  phone:            string;
}

export interface Photographer {
  id:               string;
  name:             string;
  email:            string;
  image:            string;
  rating:           number;
}

export interface SessionsStats {
  total:            number;
  upcoming:         number;
  completed:        number;
  totalAmount:      number;
}

export interface SessionType {
  id:               string;
  name:             string;
}

interface UserStoreState {
  session:          Session | null;
  sessions:         Session[];
  nextSession:      Session | null;
  stats:            SessionsStats | null;
  session_types:    SessionType[];
  loading:          boolean;
  set_session:      ( session: Session | null) => void;
  set_sessions:     ( sessions: Session[] ) => void;
  set_types:        ( types: SessionType[] ) => void;
  set_nextSession:  ( nextSession: Session | null ) => void;
  set_stats:        ( stats: SessionsStats ) => void;
  set_loading:      ( loading: boolean ) => void;
  set_photographer: ( photographer_id:string, session: Session) => void;
}


export const useUserStore = create<UserStoreState>((set, get) => ({
  session:          null,
  sessions:         [],
  nextSession:      null,
  stats:            null,
  session_types:    [],
  loading:          false,

  set_session:      (session)       => set({ session }),

  set_sessions:     (sessions)      => set({ sessions }),

  set_types:        (types)         => set({ session_types: types }),

  set_nextSession:  (nextSession)   => set({ nextSession }),

  set_stats:        (stats)         => set({ stats }),

  set_loading:      ( loading )     => set({ loading }),

  set_photographer: (photographer_id, session) => {
    const currentState = get();
    const updatedSession = { ...session, photographer_id: photographer_id };
    
    // Обновляем текущую сессию
    set({ session: updatedSession });
    
    // Обновляем сессию в массиве sessions
    const updatedSessions = currentState.sessions.map(s => 
      s.id === session.id ? updatedSession : s
    );
    set({ sessions: updatedSessions });
    
  },

}));
