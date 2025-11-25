import React, { FC } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FullScreenView } from '../../../components/Containers/FullScreenView';
import Fonts from '../../../themes/Fonts';

export interface IntroPanelProps {
  image: ImageSourcePropType;
  headerText?: string;
  bodyText: string;
  subHeaderText?: string;
  backgroundColor?: string;
  showLogo?: boolean;
}

export const IntroPanel: FC<IntroPanelProps> = ({
  image,
  headerText,
  subHeaderText,
  bodyText,
  backgroundColor = 'black',
  showLogo = false,
}) => {
  return (
    <FullScreenView backgroundColor={backgroundColor}>
      <Image
        source={image}
        style={{
          resizeMode: 'cover',
          width: '100%',
          position: 'absolute',
          top: 0,
          bottom: 0,
        }}
      />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View />
        <View
          style={{
            justifyContent: 'flex-start',
            alignSelf: 'center',
            marginTop: 50,
          }}>
          {showLogo && (
            <Image
              source={require('../../../assets/images/tlm-white.png')}
              style={localStyles.logo}
            />
          )}
          {headerText && (
            <Text style={localStyles.header}>{headerText.toUpperCase()}</Text>
          )}
          {subHeaderText && (
            <Text style={localStyles.subheader}>{subHeaderText}</Text>
          )}

          <Text style={localStyles.text}>{bodyText}</Text>
        </View>
        <View />
      </View>
    </FullScreenView>
  );
};

const localStyles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 220,
    width: '100%',
  },
  text: {
    color: 'white',
    alignSelf: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'SofiaPro-ExtraLight',
    fontSize: 24,
    lineHeight: 36,
  },
  logo: {
    //width: 50,
    resizeMode: 'contain',
    height: 200,
    alignSelf: 'center',
  },
  header: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
    alignSelf: 'center',
    marginHorizontal: 50,
    textAlign: 'center',
  },
  subheader: {
    ...Fonts.style.h2,
    color: 'white',
    alignSelf: 'center',
  },
});
