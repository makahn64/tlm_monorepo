import { types } from 'mobx-state-tree';
import auth from '@react-native-firebase/auth';

export const UserModel = types
  .model('User', {
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
