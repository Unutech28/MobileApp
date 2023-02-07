import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import GLOBALS from '@constants';
import { strings } from '@localization';
const { FONTS, COLOR } = GLOBALS;
// import Dash from 'react-native-dash';
export default class HintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      // this.props.closeModal();
    }, 5000);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.closeModal()}
        style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.swipeBackContainer}>
            <Text style={styles.textName}>
              {strings.cards.swipe}
              {'\n'}
              {strings.cards.back}
            </Text>
          </View>
          {/* <View>
            <Dash
              dashGap={8}
              dashLength={7}
              dashColor={'white'}
              style={styles.borderAdd}
            />
          </View> */}

          <View style={styles.swipeNextContainer}>
            <Text style={styles.textName}>
              {strings.cards.swipe}
              {'\n'}
              {strings.mood.next}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
  innerContainer: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  swipeNextContainer: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeBackContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderAdd: {
    flexDirection: 'column',
    height: '100%',
  },
  textName: {
    color: COLOR.WHITE,
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: '500',
    fontFamily: FONTS.MEDIUM,
    fontWeight: '700',
  },
});
