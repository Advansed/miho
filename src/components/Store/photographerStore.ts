import { create } from 'zustand';

export interface Photographer {
  id:                       string;
  name:                     string;
  email:                    string;
  image:                    string;
  rating:                   number;
}

interface PhotographerStoreState {
  photographers:            Photographer[];
  loading:                  boolean;
  set_photographers:        (photographers: Photographer[]) => void;
  set_loading:              (loading: boolean) => void;
  get_photographer_by_id:   (id: string) => Photographer | undefined;
}

export const usePhotographerStore = create<PhotographerStoreState>((set, get) => ({
  photographers:            [],
  loading:                  false,

  set_photographers:        (photographers) => set({ photographers }),

  set_loading:              (loading) => set({ loading }),

  get_photographer_by_id:   (id) => {
    const state = get();
    return state.photographers.find(p => p.id === id);
  },

}));
