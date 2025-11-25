import Reactotron from 'reactotron-react-native';

export const log = (message: string) => {
  if (Reactotron !== undefined) {
    Reactotron.log!(message);
  }
};

export const logImportant = (message: string) => {
  if (Reactotron !== undefined) {
    Reactotron.logImportant!(message);
  }
};

export const display = (message: object) => {
  if (Reactotron !== undefined) {
    Reactotron.display(message);
  }
};
