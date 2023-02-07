import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import styles from '../styles';
export default class Toolbar extends Component {
  get computedSources() {
    return {
      callButtonImage: this.props.callButtonState
        ? require('../assets/callEnd.png')
        : require('../assets/callStart.png'),
      cameraButtonImage: this.props.cameraButtonState
        ? require('../assets/cameraOff.png')
        : require('../assets/cameraOn.png'),
      microphoneButtonImage: this.props.microphoneButtonState
        ? require('../assets/microphoneOff.png')
        : require('../assets/microphoneOn.png'),
    };
  }

  render() {
    if (this.props.isToolbarHidden) {
      return (
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.arrowHelperButton}
            onPress={this.props.togglePressHandler}>
            <Image
              style={styles.arrowHelperImage}
              source={require('../assets/toolbar-arrow-up.png')}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.arrowHelperButton}
            onPress={this.props.togglePressHandler}>
            <Image
              style={styles.arrowHelperImage}
              source={require('../assets/toolbar-arrow-down.png')}
            />
          </TouchableOpacity>
          <View style={styles.toolbar}>
            <View style={styles.toolbarLeft} />
            <View style={styles.toolbarCenter}>
              <TouchableHighlight
                style={styles.toolbarButton}
                onPress={this.props.cameraButtonPressHandler}>
                <Image
                  style={styles.buttonImage}
                  source={this.computedSources.cameraButtonImage}
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.toolbarButton}
                onPress={this.props.callButtonPressHandler}>
                <Image
                  style={styles.buttonImage}
                  source={this.computedSources.callButtonImage}
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.toolbarButton}
                onPress={this.props.microphoneButtonPressHandler}>
                <Image
                  style={styles.buttonImage}
                  source={this.computedSources.microphoneButtonImage}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.toolbarRight}>
              <Text style={styles.text}>{this.props.clientVersion}</Text>
            </View>
          </View>
        </View>
      );
    }
  }
}

