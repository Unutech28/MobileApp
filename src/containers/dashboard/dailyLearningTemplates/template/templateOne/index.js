/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import * as AppActions from '@actions';
import { ThemeContext } from '@hoc/withRedux';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Text, AsyncStorage, AppState } from 'react-native';
const { FONTS, STRINGS, COLOR } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import { bindActionCreators } from 'redux';
// const TemplateOneComponent = lazy(() => import('@components/dashboard/dailyLearningTemplates/templateOne'));
const TemplateOneComponent = lazy(() => import('@components/dashboard/dailyLearningTemplates/template/templateOne'));

class TemplateOne extends Component {
  static contextType = ThemeContext;
  VideoRef;

  setRefOfVideo = (ref) => {
    this.VideoRef = ref
  }

  submitBtnClicked = (like, comment, rating, card_id) => {
    let { loginData } = this.props;
    let postData = {
      user_id: loginData['user']['_id'],
      card_id: card_id
    }

    if (like != null) {
      postData["like"] = like;
      postData["hasUserLiked"] = true;
    }
    else if (comment != null) {
      postData["comment"] = comment;
      postData["hasUserCommented"] = true;
    }
    else if (rating != null) {
      postData["rating"] = rating;
      postData["hasUserRated"] = true;
    }
    this.props.AppActions.likeCommentRatingApi(postData)
  }

  render() {
    let {
      loginData,
      description,
      cardData,
      onLikeClick,
      onCommentClick
    } = this.props;

    return (
      <View style={Styles.homeContainer}>
        <TemplateOneComponent
          cardData={cardData}
          onLikeClick={onLikeClick}
          onCommentClick={onCommentClick}
          setRefOfVideo={this.setRefOfVideo}

        />
      </View>
    );
  }
}


const mapStateToProps = ({ authReducer }) => ({
  loginData: authReducer.loginData,
});

const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateOne);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
});
