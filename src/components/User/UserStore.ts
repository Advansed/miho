// UserStore.ts
import { create } from 'zustand';

export type SessionStatus = 'planned' | 'pending_payment' | 'finished';

export interface UserSession {
  id: number;
  date: string; // 'YYYY-MM-DD'
  type: string;
  locationHint?: string;
  status: SessionStatus;
  isPaid: boolean;
  amount: number;
}

export interface SessionsStats {
  total: number;
  upcoming: number;
  completed: number;
  totalAmount: number;
}

interface UserStoreState {
  sessions: UserSession[];
  nextSession: UserSession | null;
  stats: SessionsStats | null;
  setSessionsData: (data: {
    sessions: UserSession[];
    stats: SessionsStats;
    nextSession: UserSession | null;
  }) => void;
}


export const useUserStore = create<UserStoreState>((set) => ({
  sessions:     [],
  nextSession:  null,
  stats:        null,

  setSessionsData: ({ sessions, stats, nextSession }) =>
    set(() => ({
      sessions,
      stats,
      nextSession,
    })),
}));
