/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import * as AppActions from '@actions';
import { ThemeContext } from '@hoc/withRedux';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Text, AsyncStorage, AppState } from 'react-native';
const { FONTS, STRINGS } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import { bindActionCreators } from 'redux';
// const TemplateOneComponent = lazy(() => import('@components/dashboard/dailyLearningTemplates/templateOne'));
const TemplateFiveComponent = lazy(() => import('@components/dashboard/dailyLearningTemplates/template/TemplateFive'));

class TemplateFive extends Component {
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
            cardData
        } = this.props;

        return (
            <View style={Styles.homeContainer}>
                <TemplateFiveComponent
                    cardData={cardData}
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

export default connect(mapStateToProps, mapDispatchToProps)(TemplateFive);

const Styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
    },
});
