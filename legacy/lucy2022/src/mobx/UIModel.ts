import { types } from 'mobx-state-tree';

export const UIStateModel = types
  .model('UI', {
    isLoaderVisible: false,
    loaderMessage: '',
    isFlowerVisible: false,
    flowerMessage: '',
  })
  .actions((self) => {
    return {
      showLoader(message = '') {
        self.isLoaderVisible = true;
        self.loaderMessage = message;
      },
      hideLoader() {
        self.isLoaderVisible = false;
        self.loaderMessage = '';
      },
      showFlower(message = '') {
        self.isFlowerVisible = true;
        self.flowerMessage = message;
      },
      hideFlower() {
        self.isFlowerVisible = false;
        self.flowerMessage = '';
      },
    };
  });
