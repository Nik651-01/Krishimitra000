
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  requestLocation: () => void;
  setLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      loading: false,
      error: null,
      initialized: false, // To check if store has been hydrated from localStorage
      setLocation: (location) => set({ location }),
      requestLocation: () => {
        if (navigator.geolocation) {
          set({ loading: true, error: null });
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              set({ location: { latitude, longitude }, loading: false });
            },
            (error) => {
              let errorMessage = "An unknown error occurred.";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = "You denied the request for Geolocation.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = "Location information is unavailable.";
                  break;
                case error.TIMEOUT:
                  errorMessage = "The request to get user location timed out.";
                  break;
              }
              set({ error: errorMessage, loading: false });
            }
          );
        } else {
          set({ error: "Geolocation is not supported by this browser.", loading: false });
        }
      },
    }),
    {
      name: 'location-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;
        }
      },
    }
  )
);

// Mark the store as initialized after rehydration
useLocationStore.setState({ initialized: true });
