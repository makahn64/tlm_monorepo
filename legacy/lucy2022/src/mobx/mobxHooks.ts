import { useContext } from 'react';
import { StoreContext } from './MSTProvider';

export const useDebug = () => {
  const store = useContext(StoreContext);
  return {
    videoRate: store?.debug.videoRate,
    setVideoRate: store?.debug.setVideoRate,
    skipWorkout: store?.debug.skipWorkout,
    setShowHzWorkouts: store?.debug.setShowHzWorkouts,
    showHzWorkouts: store?.debug.showHzWorkouts,
    showIdOverlay: store?.debug.showIdOverlay,
  };
};

export const useAppState = () => {
  const store = useContext(StoreContext);
  if (store === null) {
    // this means the MSTProvider is not a parent of the component using this hook and that is very bad
    throw new Error(
      'Store is null in MSTProvider, is it instantiated near the top of the app component hierarchy?',
    );
  }
  return store;
};

export const useUI = () => {
  const store = useAppState();
  return store.ui;
}

export const useAuth = () => {
  const store = useAppState();
  return store.auth;
}
