import { types } from 'mobx-state-tree';

export const DebugStateModel = types
  .model('Debug', {
    // persisted settings for debug (and more maybe eventually),
    videoRate: 1,
    skipWorkout: false,
    showHzWorkouts: false,
    showIdOverlay: false,
  })
  .actions((self) => {
    return {
      setVideoRate(rate: number) {
        self.videoRate = rate;
      },
      setSkipWorkout(skip: boolean) {
        self.skipWorkout = skip;
      },
      setShowHzWorkouts(showHz: boolean) {
        self.showHzWorkouts = showHz;
      },
      setShowIdOverlay(show: boolean) {
        self.showIdOverlay = show;
      },
    };
  })
  .views((_self) => ({
    get release() {
      return 'hello';
    },
  }));
