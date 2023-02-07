// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop } from '@config/navigationOptions';
import GLOBALS from '@constants';
import moment from 'moment';
import React, { Component, lazy } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { strings } from '@localization';
import Styles from '../styles';
const { COLOR, STRINGS } = GLOBALS;
const AddOtherActivityComponent = lazy(() =>
  import('@components/dashboard/activityTracker/addOtherActivity'),
);
const Header = lazy(() => import('@components/common/Header'));
import momentZone from 'moment-timezone';
let currentTimeZone = momentZone.tz.guess();

let categoryArray = [
  {
    value: 'Excercise',
    id: 0,
  },
  {
    value: 'Pleasent Activity',
    id: 1,
  },
  {
    value: 'Sports',
    id: 2,
  },
  {
    value: 'Other',
    id: 3,
  },
];

let addActivityArray = [
  {
    name: 'Rearranging my room ',
    id: 0,
  },
  {
    name: 'Reorganizing my house',
    id: 1,
  },
  {
    name: 'Biking',
    id: 2,
  },
  {
    name: 'Be outdoors',
    id: 3,
  },
  {
    name: 'See beautiful scenery',
    id: 4,
  },
  {
    name: 'Compliment someone',
    id: 5,
  },
  {
    name: 'Playing sports ',
    id: 6,
  },
  {
    name: 'Spend time with friends',
    id: 7,
  },
  {
    name: 'Reminisce, talk about old times',
    id: 8,
  },
  {
    name: 'Talk on the telephone',
    id: 9,
  },
  {
    name: 'Spend time with family',
    id: 10,
  },
  {
    name: 'Planning or organizing something',
    id: 11,
  },
  {
    name: 'Visiting friends',
    id: 12,
  },

  {
    name: 'Call an old friend',
    id: 13,
  },
  {
    name: 'Go to a meeting',
    id: 14,
  },
  {
    name: 'Make a new friend',
    id: 15,
  },
  {
    name: 'Go to a church function',
    id: 16,
  },
  {
    name: 'Do volunteer work',
    id: 17,
  },
  {
    name: 'Sending a card to someone',
    id: 18,
  },
  {
    name: 'Planting flowers or buying a potted plant',
    id: 19,
  },
  {
    name: 'Help someone',
    id: 20,
  },
  {
    name: 'Petting/walking/grooming your cat or dog',
    id: 21,
  },
  {
    name: 'Care for a houseplant',
    id: 22,
  },
  {
    name: 'Take a long bath ',
    id: 23,
  },
  {
    name: 'Eat a good meal',
    id: 24,
  },
  {
    name: 'Wear clothes I like',
    id: 25,
  },
  {
    name: 'Go to a park, fair, or zoo',
    id: 26,
  },
  {
    name: 'Go to a garage sale',
    id: 27,
  },
  {
    name: 'Play a video game',
    id: 28,
  },
  {
    name: 'Do artwork or crafts',
    id: 29,
  },
  {
    name: 'Collect things',
    id: 30,
  },
  {
    name: 'Play card games or chess',
    id: 31,
  },
  {
    name: 'Go to a movie or play',
    id: 32,
  },
  {
    name: 'Going on an outing to an event',
    id: 33,
  },
  {
    name: 'Going to a museum or exhibit',
    id: 34,
  },
  {
    name: 'Learning to do something new',
    id: 35,
  },
  {
    name: 'Listen to birds sing',
    id: 36,
  },
  {
    name: 'Sing',
    id: 37,
  },
  {
    name: 'Do outdoor work',
    id: 38,
  },
  {
    name: 'Get haircut/hair done',
    id: 39,
  },
  {
    name: 'Go to the library',
    id: 40,
  },
  {
    name: 'Write letters',
    id: 41,
  },
  {
    name: 'Keeping a journal',
    id: 42,
  },
  {
    name: 'Read the newspaper',
    id: 43,
  },
  {
    name: 'Write stories or poetry',
    id: 44,
  },
  {
    name: 'Read books or magazines',
    id: 45,
  },
  {
    name: 'Read something inspiring',
    id: 46,
  },
  {
    name: 'Reading through old letters or journals',
    id: 47,
  },
  {
    name: 'Do crossword puzzles',
    id: 48,
  },
  {
    name: 'Say prayers',
    id: 49,
  },
  {
    name: 'Have peace and quiet',
    id: 50,
  },
  {
    name: 'Daydream',
    id: 51,
  },
  {
    name: 'Watch a sunse',
    id: 52,
  },
  {
    name: 'Watch people',
    id: 53,
  },
  {
    name: 'Look at clouds',
    id: 54,
  },
  {
    name: 'Looking at old photographs',
    id: 55,
  },
  {
    name: 'Sitting in a place of worship',
    id: 56,
  },
  {
    name: 'Solve a personal problem',
    id: 57,
  },
  {
    name: 'Keep a clean house',
    id: 58,
  },
  {
    name: 'Listen to sounds of nature',
    id: 59,
  },
  {
    name: 'Listen to the radio',
    id: 60,
  },
  {
    name: 'Sitting in the sun',
    id: 61,
  },
  {
    name: 'Cleaning',
    id: 62,
  },
  {
    name: 'Laundry',
    id: 63,
  },
  {
    name: 'Hydrate with water',
    id: 64,
  },
  {
    name: 'Work',
    id: 65,
  },
];

let timeArray = [
  {
    value: '10 minutes',
    id: 10,
    points: 0,
  },
  {
    value: '15 minutes',
    id: 15,
    points: 100,
  },
  {
    value: '20 minutes',
    id: 20,
    points: 0,
  },
  {
    value: '25 minutes',
    id: 25,
    points: 0,
  },
  {
    value: '30 minutes',
    id: 30,
    points: 200,
  },
  {
    value: '35 minutes',
    id: 35,
    points: 0,
  },
  {
    value: '40 minutes',
    id: 40,
    points: 0,
  },
  {
    value: '45 minutes',
    id: 45,
    points: 300,
  },
  {
    value: '50 minutes',
    id: 50,
    points: 0,
  },
  {
    value: '55 minutes',
    id: 55,
    points: 0,
  },
  {
    value: '60 minutes',
    id: 60,
    points: 400,
  },
  {
    value: '65 minutes',
    id: 65,
    points: 0,
  },
  {
    value: '70 minutes',
    id: 70,
    points: 0,
  },
  {
    value: '75 minutes',
    id: 75,
    points: 500,
  },
  {
    value: '80 minutes',
    id: 80,
    points: 0,
  },
  {
    value: '85 minutes',
    id: 85,
    points: 0,
  },
  {
    value: '90 minutes',
    id: 90,
    points: 600,
  },
  {
    value: '95 minutes',
    id: 95,
    points: 0,
  },
  {
    value: '100 minutes',
    id: 100,
    points: 0,
  },
  {
    value: '105 minutes',
    id: 105,
    points: 700,
  },
  {
    value: '110 minutes',
    id: 110,
    points: 0,
  },
  {
    value: '115 minutes',
    id: 115,
    points: 0,
  },
  {
    value: '120 minutes',
    id: 120,
    points: 800,
  },
  {
    value: '125 minutes',
    id: 125,
    points: 0,
  },
  {
    value: '130 minutes',
    id: 130,
    points: 0,
  },
  {
    value: '135 minutes',
    id: 135,
    points: 900,
  },
  {
    value: '140 minutes',
    id: 140,
    points: 0,
  },
  {
    value: '145 minutes',
    id: 145,
    points: 0,
  },
  {
    value: '150 minutes',
    id: 150,
    points: 1000,
  },
];

class AddOtherActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
  }

  componentDidUpdate() {
    let { componentId } = this.props;
    if (this.props.getSaveOtherActivityData !== undefined) {
      this._callActivityTrackerAPI();
      navigatorPop({ componentId });
    }
  }

  _callActivityTrackerAPI() {
    let { loginData } = this.props;
    let postData = {
      hospital_id: loginData.user.hospital_id,
      patient_id: loginData.user._id,
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getActivityTrackerApi(postData);
    this.props.AppActions.getSelectedActivityTracker(postData);
  }

  addOtherActivity = data => {
    //call save api
    let { componentId, selectedListArray } = this.props;
    let patientActivityArray =  selectedListArray.concat(data)
    console.log('patientActivityArray>>>',patientActivityArray)
    const timeStamp = moment().format();
    const currentDate = moment(timeStamp).format('YYYY-MM-DD');
    let postData = {
      date: currentDate ,
      trackerId: this.props.trackerId,
      data: patientActivityArray
      }
      console.log('postData>>', postData)
      this.props.AppActions.saveTrackers(postData, componentId);
    // selectedListArray.forEach(x => {
    //   let obj = {
    //     activity_id: x._id,
    //   };
    //   patientActivityArray.push(obj);
    // });

    // data.forEach(element => {
    //   let obj = {
    //     activity_id: element._id,
    //   };
    //   patientActivityArray.push(obj);
    // });

    // let postData = {
    //   hospital_id: loginData.user.hospital_id,
    //   user_id: loginData.user._id,
    //   patientactivity: patientActivityArray,
    //   _id: updateId,
    //   patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
    //   timeZone: currentTimeZone,
    //   user_language
    // };
    // this.props.AppActions.saveOtherActivity(postData, componentId, user_language);
  };

  render() {
    let { componentId, AddPlesantActivityArray } = this.props;

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.activity.AddNewActivity}
          isLogout={false}
          titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
        />

        <View style={{ flex: 1 }}>
          <AddOtherActivityComponent
            categoryArray={categoryArray}
            timeArray={timeArray}
            addOtherActivity={this.addOtherActivity}
            addActivityArray={AddPlesantActivityArray}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  getActivityTrackerData: dashboardReducer.getActivityTrackerData,
  getSaveOtherActivityData: dashboardReducer.getSaveOtherActivityData,
  user_language: authReducer.language,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddOtherActivity);

