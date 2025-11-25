import Fonts from '../../themes/Fonts';

const getTabBarOptions = (theme) => {
  return {
    activeTintColor: theme.primary,
    inactiveTintColor: theme.muted,
    indicatorStyle: {
      backgroundColor: theme.primary,
    },
    labelStyle: {
      ...Fonts.style.topTab,
    },
    style: {
      backgroundColor: theme.surface,
    },
    tabStyle: {
      padding: 2,
    },
  };
};

export default getTabBarOptions;
