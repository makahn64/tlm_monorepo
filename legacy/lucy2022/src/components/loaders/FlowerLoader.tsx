import React from 'react';
import {observer} from "mobx-react-lite";
import {useUI} from "../../mobx/mobxHooks";
import {StyleSheet, View, Text} from "react-native";


export const FlowerLoader = observer(() => {

  const { isFlowerVisible, flowerMessage } = useUI();
  if (!isFlowerVisible) return null;

  return (
    <View style={styles.fullscreen}>
      <Text style={styles.loaderMessage}>{flowerMessage}</Text>
    </View> )
});

  const styles = StyleSheet.create({
    fullscreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'red',
      opacity: 0.5,
      padding: 50,
      justifyContent: 'center',
      zIndex: 10000
    },
    loaderMessage: {
      fontFamily: 'courier',
      fontSize: 28,
      color: '#ffffff',
      textAlign: 'center'
    }
  })
