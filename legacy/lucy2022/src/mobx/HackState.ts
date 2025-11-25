import { types } from 'mobx-state-tree';

export const HackStateModel = types
  .model('Debug', {
    // persisted settings for debug (and more maybe eventually),
    nextButtonLabel: 'NEXT',
  })
  .actions((self) => {
    return {
      setNextButtonLabel(label: string) {
        self.nextButtonLabel = label;
      },
    };
  });
