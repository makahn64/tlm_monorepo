import React, { FC } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { IntroPanel, IntroPanelProps } from './IntroPanels/IntroPanel';
import { useNavigation } from '@react-navigation/core';
import { VerticalGap } from '~components/spacing';
import Carousel from 'react-native-snap-carousel';
import { ColorTheme } from '../../theme';
//import { ColdStackParams } from '../../navigation/ColdState/ColdStateNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TLMButton } from '~components/Buttons';
import {useTheme} from "~theme/ThemeProvider";

const width = Dimensions.get('screen').width;

const slides: IntroPanelProps[] = [
  {
    headerText: undefined,
    subHeaderText: 'your virtual pre/postnatal expert',
    bodyText: 'because guidance and support is more important than ever',
    showLogo: true,
    image: require('../../assets/images/welcome1.jpg'),
  },
  {
    headerText: 'workouts that fit your lifestyle',
    bodyText:
      "in these uncertain times, it's easy to let your fitness slip. With The Lotus Method we're there when and where you need us.",
    showLogo: false,
    image: require('../../assets/images/welcome2.jpg'),
  },
  {
    headerText: 'your pre/postnatal expert awaits…',
    bodyText:
      'your personal expert will assess for diastasis recti, pelvic floor dysfunction, compensation patterns, birth story complications and more.',
    showLogo: false,
    image: require('../../assets/images/welcome3.jpg'),
  },
];

export const ColdLandingScreen: FC = () => {
  const navigation = useNavigation<
    NativeStackNavigationProp<ColdStackParams>
  >();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const goLogin = () => {
    navigation.navigate('LoginOrCreate', { flow: 'login' });
  };

  const goOnboarding = () => {
    navigation.navigate('LoginOrCreate', { flow: 'create' });
  };

  const renderSubview = ({ item }) => {
    return (
      <IntroPanel
        bodyText={item.bodyText}
        headerText={item.headerText}
        image={item.image}
        showLogo={item.showLogo}
      />
    );
  };

  return (
    <FullScreenView backgroundColor="#000000">
      <Carousel
        data={slides}
        renderItem={renderSubview}
        itemWidth={width}
        sliderWidth={width}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
      />
      <View style={styles.buttonContainer}>
        <TLMButton text="Create Account" onPress={goOnboarding} />
        <VerticalGap gap={1} />
        <TLMButton
          text="Sign In"
          onPress={goLogin}
          color={brandPalette.iris}
          shadowColor={brandPalette.irisLight}
        />
        <VerticalGap gap={2} />
      </View>
    </FullScreenView>
  );
};

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    button: {
      width: '90%',
    },
    buttonFaded: {
      width: '90%',
      backgroundColor: colors.muted50,
    },
    text: {
      color: 'white',
      ...Fonts.style.h3,
      alignSelf: 'center',
      marginHorizontal: 10,
      marginTop: 15,
      textAlign: 'center',
      fontWeight: '400',
      opacity: 0.7,
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 30,
    },
  });
