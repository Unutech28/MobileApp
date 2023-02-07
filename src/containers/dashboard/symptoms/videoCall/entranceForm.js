import React, {Component} from 'react';
import {StyleSheet, TextInput, Animated, Text} from 'react-native';
import styles from '../styles';
export default class EntranceForm extends Component {
  render() {
    return (
      <Animated.View
        style={[
          styles.form,
          {transform: [{translateY: this.props.eFormBounceValue}]},
        ]}>
        <Text style={styles.title}>{'Join to conference'}</Text>
        <TextInput
          style={styles.input}
          placeholder={'host'}
          value={this.props.host}
          onChangeText={text => {
            this.props.inputTextChanged({target: 'host', text});
          }}
        />
        <TextInput
          style={styles.input}
          placeholder={'token'}
          value={this.props.token}
          onChangeText={text =>
            this.props.inputTextChanged({target: 'token', text})
          }
        />
        <TextInput
          style={styles.input}
          placeholder={'displayName'}
          value={this.props.displayName}
          onChangeText={text =>
            this.props.inputTextChanged({target: 'displayName', text})
          }
        />
        <TextInput
          style={styles.input}
          placeholder={'resourceId'}
          value={this.props.resourceId}
          onChangeText={text =>
            this.props.inputTextChanged({target: 'resourceId', text})
          }
        />
      </Animated.View>
    );
  }
}


