import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from "react-native";
import { FullScreenView } from '../../../components/Containers/FullScreenView';
import Fonts from '../../../themes/Fonts';

interface Props {}

export const IntroPanelTwo: FC = () => {

  return (
    <FullScreenView backgroundColor={'black'}>
      <Image source={require('../../../assets/images/welcome1.jpg')} style={{ resizeMode: 'cover', width: '100%', position: 'absolute', top: 0, bottom: 0}}/>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View/>
        <View style={{ justifyContent: 'flex-start', alignSelf: 'center', marginTop: 50 }}>
          <Image source={require('../../../assets/images/logo-gray.png')} style={localStyles.logo}/>
          <Text style={localStyles.header}>Page 2</Text>
          <Text style={localStyles.text}>You can't join The Lotus Method through the app, but check out our website for more info.</Text>
        </View>
        <View/>
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
    ...Fonts.style.h2,
    alignSelf: 'center',
    marginHorizontal: 50,
    marginTop: 30,
    textAlign: 'center'
  },
  logo: {
    width: 50,
    resizeMode: 'contain',
    height: 100,
    alignSelf: 'center'
  },
  header: {
    ...Fonts.style.h1,
    color: 'white',
    alignSelf: 'center'
  },
});

