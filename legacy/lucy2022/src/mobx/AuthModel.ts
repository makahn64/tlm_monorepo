import { types } from 'mobx-state-tree';
import auth from '@react-native-firebase/auth';

export const AuthModel = types
  .model('Auth', {
    isLoggedIn: false,
  })
  .actions((self) => {
    return {
      setIsLoggedIn(isLoggedIn: boolean) {
        self.isLoggedIn = isLoggedIn;
      }

    };
  })
  .views((self) => ({
    get currentUser() {
      return auth().currentUser;
    }
  }));
