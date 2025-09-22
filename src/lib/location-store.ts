
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getLocationFromCoords, LocationAddress } from '@/ai/flows/get-location-from-coords';
import { WeatherForecast } from '@/ai/flows/get-weather-forecast';


interface Location {
  latitude: number;
  longitude: number;
}

type CachedWeatherForecast = WeatherForecast & {
  fetchedAt: string;
};

interface LocationState {
  location: Location | null;
  address: LocationAddress | null;
  weather: CachedWeatherForecast | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  requestLocation: () => void;
  setLocation: (location: Location) => void;
  setWeather: (weather: WeatherForecast) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      address: null,
      weather: null,
      loading: false,
      error: null,
      initialized: false, // To check if store has been hydrated from localStorage
      setLocation: (location) => set({ location }),
      setWeather: (weather) => set({ 
          weather: { ...weather, fetchedAt: new Date().toISOString() } 
      }),
      requestLocation: () => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
          set({ loading: true, error: null });
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const location = { latitude, longitude };
              set({ location, loading: false });

              try {
                const address = await getLocationFromCoords(location);
                set({ address });
              } catch (e) {
                console.error("Failed to get address from coordinates", e);
                // We can still proceed without the address
              }
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
        } else if (typeof window !== 'undefined') {
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
