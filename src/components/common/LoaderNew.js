import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GLOBALS from "../../constants";
const { COLOR } = GLOBALS;

// common loader 
class Loading extends Component {
  render() {
    if (!this.props.loading) {
      return null;
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.innerView}>
          <ActivityIndicator size="large" color={COLOR.PRIMARY} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer }) => ({
  loading: authReducer.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    zIndex: 110,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    elevation: 1
  },
  innerView: { flex: 1, justifyContent: "center", alignItems: "center" },
});
