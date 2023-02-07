import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import styles from '../styles';

export default class TimerText extends Component {

  render() {
    const { minutesLong, ...rest } = this.props;

    const hours = Math.floor(minutesLong / 60);
    const minutes = minutesLong - hours * 60;

    return (
      <View {...rest}>
        <View style={styles.timerContainer}>
          <Text style={styles.timeText}>{hours}</Text>
          <Text style={styles.text}>HR</Text>
          <Text style={[styles.timeText, styles.span]}>{minutes}</Text>
          <Text style={styles.text}>MIN</Text>
        </View>
      </View>
    );
  }
}

