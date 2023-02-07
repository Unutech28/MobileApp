/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import styles from './styles';
export default class Demo extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viwStyle}>
          <View style={{ flex: 0.7, backgroundColor: 'blue' }}>
            <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: 'red', alignItems: 'center' }}>
              <Text style={styles.textStyle}>111</Text>
            </View>
            <View style={{ flex: 0.3, justifyContent: 'center', backgroundColor: 'blue', alignItems: 'center' }}>
              <Text style={styles.textStyle}>222</Text>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'center', backgroundColor: 'purple', alignItems: 'center' }}>
              <Text style={styles.textStyle}>333</Text>
            </View>
          </View>
          <View style={{ flex: 0.3, backgroundColor: 'orange' }}>
            <View style={{ flex: 0.5, justifyContent: 'center', backgroundColor: 'yellow', alignItems: 'center' }}>
              <Text style={styles.textStyle}>444</Text>
            </View>
            <View style={{ flex: 0.5, justifyContent: 'center', backgroundColor: 'green', alignItems: 'center' }}>
              <Text style={styles.textStyle}>555</Text>
            </View>
            {/* <Text style={styles.textStyle}>Priyanka 2</Text> */}
          </View>

        </View>
        <View style={{ flex: 0.5, backgroundColor: 'yellow' }}>
          <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange' }}>
            <Text style={styles.textStyle}>666</Text>
          </View>
          <View style={{ flex: 0.5, flexDirection: 'row' }}>
            <View style={{ flex: 0.33, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.textStyle}>777</Text>
            </View>
            <View style={{ flex: 0.33, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.textStyle, { color: 'white' }]}>777</Text>
            </View>
            <View style={{ flex: 0.33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.textStyle}>777</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


