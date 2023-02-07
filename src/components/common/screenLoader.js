/* eslint-disable module-resolver/use-alias */
// @flow

import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as Sentry from "@sentry/react-native";
class App extends Component {
  componentWillUnmount() { }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  welcome: {
    fontSize: 28,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Sentry.wrap(App)
