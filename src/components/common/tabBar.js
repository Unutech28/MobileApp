/* eslint-disable react-native/no-inline-styles */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import * as Images from "@images";
import { Tab } from "@components/common/tabSwitcher";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ModalView from "react-native-modal";
import { navigatorPush, navigatorRoot } from "@config/navigationOptions";
import { storeObj } from "@store/setup";
import Icon from "react-native-vector-icons/Ionicons";
import { Navigation } from "react-native-navigation";
const { FONTS, COLOR, STRINGS, PRODUCT_TYPE } = GLOBALS;
const { WHITE, tabIcon } = COLOR;
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AppActions from "@actions";
import { strings } from "@localization";
import AlertModal from "../../components/common/AlertModal";
import { useSelector, useDispatch } from "react-redux";

const CommonTabUI = ({ id, name, isLineVisible }) => {
  return (
    <View style={{ marginHorizontal: RFValue(15) }}>
      {isLineVisible ? (
        <View
          style={{
            borderWidth: 0.5,
            borderColor: COLOR.BORDER_DARK,
          }}
        />
      ) : null}
      <View style={Styles.touchableStyle}>
        <View style={Styles.imageViewStyle}>
          {id === "Sleep" ? (
            <Image
              source={Images.sleepTab}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}

          {id === "Mood" ? (
            <Image
              source={Images.moodTab}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}

          {id === "Activity" ? (
            <Image
              source={
                PRODUCT_TYPE == "CU002" ? Images.diaper : Images.activityTab
              }
              // source={Images.activityTab}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}

          {id === "DailyLearning" ? (
            <Image
              source={Images.dailyLearningTab}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}

          {id === "assessment" ? (
            <Image
              source={Images.dailyLearningTab}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}

          {id === "Journal" ? (
            <Image
              source={Images.diary}
              resizeMode="contain"
              style={Styles.trackerImageStyle}
            />
          ) : null}
        </View>
        <View style={Styles.textViewStyle}>
          <Text style={Styles.modalTextStyle}>{name}</Text>
        </View>
      </View>
    </View>
  );
};

const Home = (props) => {
  const [selectedTab, setSelectedTab] = useState(STRINGS.PLAYLIST);
  const [isModalVisible, setModelVisible] = useState(false);
  const [isPlusBtnShow, setPlusBtnUI] = useState(true);
  const [temp, setTemp] = useState(0);
  const [isSleep, setIsSleep] = useState(false);
  const [isMood, setIsMood] = useState(false);
  const [isActivity, setIsActivty] = useState(false);

  let assessmentData =
    storeObj.store.getState().assessmentsReducer.allAssessments;
  let playlistDynamicRes =
    storeObj.store.getState().playlistReducer.playlistDynamicRes;
  let popupStatus = storeObj.store.getState().dashboardReducer.isPopupShow;
  let trackers = storeObj.store.getState().dashboardReducer.getAllTrackers;

  const dispatch = useDispatch();
  const onPluseClick = () => {
    setPlusBtnUI(false);
    setModelVisible(true);
  };
  const onCloseClick = () => {
    setPlusBtnUI(true);
    setModelVisible(false);
  };
  const navigateToTracker = (type, item = null, data) => {
    setTimeout(() => {
      setPlusBtnUI(true);
    }, 1000);

    let { componentId, onModalItemPress } = props;
    console.log("mood item here ===>", data);
    onModalItemPress(type, item, data);
  };
  useEffect(() => {
    console.log("trackers====>", trackers);
    trackers?.length > 0 &&
      trackers?.map((item) => {
        if (item?.tracker?.value == "mood") {
          setIsMood(true);
        } else if (item?.tracker?.value == "activity") {
          setIsActivty(true);
        } else if (item?.tracker?.value == "sleep") {
          setIsSleep(true);
        }
      });
  }, [trackers]);

  useEffect(() => {}, [temp, COLOR.DARK_GREEN]);

  const Alltrackers = ({ data }) => {
    return (
      <>
        {data?.tracker?.value === "mood" ? (
          <Tab
            // id={STRINGS.MOOD}
            modelVisible={() => {
              setModelVisible(false);
            }}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(true);
            }}
            tabSelected={() => {
              navigateToTracker("mood", data, data);
            }}
          >
            <CommonTabUI
              id={"Mood"}
              // name={"Mood Check In"}
              name={
                PRODUCT_TYPE == "CU002"
                  ? strings.home.moodCU002
                  : strings.tab3.mood
              }
              isLineVisible={true}
              // data={data}
            />
          </Tab>
        ) : null}

        {/* {type === "Daily" ? (
            <Entypo name="open-book" size={24} color={COLOR.PRIMARY1} />
          ) : null} */}

        {/* sleep */}
        {data?.tracker?.value === "sleep" ? (
          <Tab
            // id={STRINGS.SLEEP}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(false);
            }}
            modelVisible={() => {
              setModelVisible(true);
            }}
            tabSelected={() => {
              navigateToTracker("sleep", data, data);
            }}
          >
            {/* <TouchableOpacity onPress={navigateToTracker}> */}
            <CommonTabUI
              id={"Sleep"}
              name={
                PRODUCT_TYPE == "CU002"
                  ? strings.home.sleepCU002
                  : strings.tab3.sleep_tracker
              }
              isLineVisible={true}
              data={data}
            />
            {/* </TouchableOpacity> */}
          </Tab>
        ) : null}

        {/* temp */}
        {/* {data?.tracker?.value === "temperature" ? (
            <Image
              source={Images.Activity}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null} */}

        {/* weight */}
        {/* {data?.tracker?.value === "weight" ? (
            <Image
              source={Images.Activity}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null} */}

        {/* activity */}
        {data?.tracker?.value === "activity" ? (
          <Tab
            // id={STRINGS.ACTIIVTY}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(true);
            }}
            modelVisible={() => {
              setModelVisible(false);
            }}
            tabSelected={() => {
              navigateToTracker("activity", data, data);
            }}
          >
            <CommonTabUI
              id={"Activity"}
              //  name={"Activity Tracker"}
              name={
                PRODUCT_TYPE == "CU002"
                  ? strings.home.activityCU002
                  : strings.tab3.activity
              }
              isLineVisible={true}
              data={data}
            />
          </Tab>
        ) : null}
      </>
    );
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.mainView}>
        <View style={Styles.tabViewStyle}>
          <Tab
            id={STRINGS.PLAYLIST}
            modelVisible={() => {
              // setModelVisible(false);
            }}
            playModle={() => {
              // setModelVisible(false);
            }}
            trackerIcon={() => {
              //  setPlusBtnUI(true);
            }}
            tabSelected={() => {
              //setSelectedTab(STRINGS.PLAYLIST);
            }}
          >
            <View style={Styles.activeTab}>
              <Image
                source={Images.Playlist}
                resizeMode="contain"
                style={Styles.imageStyle}
              />
              <Text style={Styles.textStyle}>{strings.tab.home}</Text>
            </View>
          </Tab>
        </View>

        <View style={Styles.tabViewStyle}>
          <Tab
            id={STRINGS.WALL}
            modelVisible={() => {
              setModelVisible(false);
            }}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(true);
            }}
            tabSelected={() => {
              setSelectedTab(STRINGS.WALL);
            }}
          >
            <View style={Styles.activeTab}>
              <Image
                source={Images.Resource}
                resizeMode="contain"
                style={Styles.imageStyle}
              />
              <Text style={Styles.textStyle} allowFontScaling={false}>
                {strings.tab.resource}
              </Text>
            </View>
          </Tab>
        </View>

        <View style={Styles.tabViewStyle}>
          <Tab
            // id={STRINGS.TRACKER}
            modelVisible={() => {
              setModelVisible(false);
            }}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(true);
            }}
            tabSelected={() => {
              setSelectedTab(STRINGS.TRACKER);
            }}
          >
            {isPlusBtnShow ? (
              <TouchableOpacity
                style={[
                  Styles.activeTabPuls,
                  {
                    marginBottom: RFValue(2),
                    marginTop: RFValue(16),
                    backgroundColor: COLOR.DARK_GREEN,
                  },
                ]}
                onPress={() => onPluseClick()}
              >
                <Image
                  source={require("../../assets/images/Plus.png")}
                  resizeMode="cover"
                  style={[Styles.playImageStyle, { marginTop: RFValue(5) }]}
                />

                {/* <Image
                  source={Images.AddButton}
                  resizeMode="cover"
                  style={Styles.playImageStyle}
                // tintColor='#2d3436'
                /> */}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  Styles.activeTabPuls,
                  {
                    marginBottom: RFValue(2),
                    marginTop: RFValue(16),
                    backgroundColor: COLOR.DARK_GREEN,
                  },
                ]}
                onPress={() => onCloseClick()}
              >
                <Image
                  source={require("../../assets/images/PlusDown.png")}
                  resizeMode="cover"
                  style={[Styles.playImageStyle, { marginRight: RFValue(8) }]}
                />
                {/* <Image
                  source={Images.DownButton}
                  resizeMode="cover"
                  style={Styles.playImageStyle}
                /> */}
              </TouchableOpacity>
            )}
          </Tab>
        </View>

        <View style={Styles.tabViewStyle}>
          <Tab
            id={STRINGS.CHAT}
            modelVisible={() => {
              // setModelVisible(false);
            }}
            playModle={() => {
              // setModelVisible(false);
            }}
            trackerIcon={() => {
              // setPlusBtnUI(true);
            }}
            tabSelected={() => {
              // setSelectedTab(STRINGS.CHAT);
            }}
          >
            <View style={Styles.activeTab}>
              <Image
                source={Images.Chat}
                resizeMode="cover"
                style={Styles.chatImageStyle}
              />
              <Text style={[Styles.textStyle, { paddingTop: 0 }]}>
                {strings.tab.chat}
              </Text>
            </View>
          </Tab>
        </View>

        <View style={Styles.tabViewStyle}>
          <Tab
            id={STRINGS.HELP}
            modelVisible={() => {
              setModelVisible(false);
            }}
            playModle={() => {
              setModelVisible(false);
            }}
            trackerIcon={() => {
              setPlusBtnUI(true);
            }}
            tabSelected={() => {
              setSelectedTab(STRINGS.HELP);
            }}
          >
            <View style={Styles.activeTab}>
              <Icon
                style={{ marginTop: 2 }}
                name={"information-circle-outline"}
                size={30}
                color={tabIcon}
              />
              <Text style={[Styles.textStyle, { paddingTop: 4 }]}>
                {strings.tab.help}
              </Text>
            </View>
          </Tab>
        </View>
      </View>

      <ModalView
        isVisible={isModalVisible}
        onSwipeComplete={() => setModelVisible(false)}
        // swipeDirection={["up", "left", "right", "down"]}
        style={Styles.bottomModal}
        onBackdropPress={() => {
          setModelVisible(false);
          setPlusBtnUI(true);
        }}
      >
        <View
          style={{
            ...Styles.content,
            flex:
              assessmentData !== undefined &&
              assessmentData !== null &&
              assessmentData.length > 0
                ? 0.5
                : 0.49,
          }}
        >
          <View style={{ padding: RFValue(15) }}>
            <Text style={Styles.modalHeading}>
              {strings.tab3.DAILY_PLAYLIST}
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* {isSleep && <Tab
              // id={STRINGS.SLEEP}
              playModle={() => {
                setModelVisible(false);
              }}
              trackerIcon={() => {
                setPlusBtnUI(false);
              }}
              modelVisible={() => {
                setModelVisible(true);
              }}
              tabSelected={() => {
                navigateToTracker('sleep');
              }}>
              <CommonTabUI
                id={'Sleep'}
                name={PRODUCT_TYPE == "CU002" ? strings.home.sleepCU002 : strings.tab3.sleep_tracker}
                isLineVisible={true}
              />
            </Tab>} */}

            <Tab
              // id={STRINGS.DAILY_LEARNING}
              playModle={() => {
                setModelVisible(false);
              }}
              trackerIcon={() => {
                setPlusBtnUI(true);
              }}
              modelVisible={() => {
                setModelVisible(false);
              }}
              tabSelected={() => {
                if (
                  playlistDynamicRes &&
                  playlistDynamicRes.week > playlistDynamicRes.totalWeeks
                ) {
                  setTimeout(() => {
                    // alert(GLOBALS.Strings.playlist.complete_learning)
                    dispatch(AppActions.togglePopup(true));
                    setTemp(temp + 1);
                  }, 500);
                } else {
                  navigateToTracker("learning");
                }
              }}
            >
              <CommonTabUI
                id={"DailyLearning"}
                name={strings.tab3.learning}
                isLineVisible={true}
              />
            </Tab>

            {trackers &&
              trackers?.map((item) => {
                return <Alltrackers data={item} />;
              })}
            {/* {isMood && <Tab
              // id={STRINGS.MOOD}
              modelVisible={() => {
                setModelVisible(false);
              }}
              playModle={() => {
                setModelVisible(false);
              }}
              trackerIcon={() => {
                setPlusBtnUI(true);
              }}
              tabSelected={() => {
                navigateToTracker('mood');
              }}>
              <CommonTabUI
                id={'Mood'}
                // name={"Mood Check In"}
                name={PRODUCT_TYPE == "CU002" ? strings.home.moodCU002 : strings.tab3.mood}
                isLineVisible={true}
              />
            </Tab>} */}
            {/* {isActivity && <Tab
              // id={STRINGS.ACTIIVTY}
              playModle={() => {
                setModelVisible(false);
              }}
              trackerIcon={() => {
                setPlusBtnUI(true);
              }}
              modelVisible={() => {
                setModelVisible(false);
              }}
              tabSelected={() => {
                navigateToTracker('activity');
              }}>
              <CommonTabUI
                id={'Activity'}
                //  name={"Activity Tracker"}
                name={PRODUCT_TYPE == "CU002" ? strings.home.activityCU002 : strings.tab3.activity}
                isLineVisible={true}
              />
            </Tab>} */}
            <Tab
              // id={STRINGS.ACTIIVTY}
              playModle={() => {
                setModelVisible(false);
              }}
              trackerIcon={() => {
                setPlusBtnUI(true);
              }}
              modelVisible={() => {
                setModelVisible(false);
              }}
              tabSelected={() => {
                navigateToTracker("journal");
              }}
            >
              <CommonTabUI
                id={"Journal"}
                //  name={"Journal"}
                name={strings.tab3.journal}
                isLineVisible={true}
              />
            </Tab>
            {assessmentData !== undefined &&
            assessmentData !== null &&
            assessmentData.length > 0
              ? assessmentData.map((item) => {
                  return (
                    <Tab
                      // id={STRINGS.MOOD}
                      modelVisible={() => {
                        setModelVisible(false);
                      }}
                      playModle={() => {
                        setModelVisible(false);
                      }}
                      trackerIcon={() => {
                        setPlusBtnUI(true);
                      }}
                      tabSelected={() => {
                        navigateToTracker("assessment", item);
                      }}
                    >
                      <CommonTabUI
                        id={"assessment"}
                        name={item.name}
                        isLineVisible={true}
                      />
                    </Tab>
                  );
                })
              : null}
          </ScrollView>
        </View>
      </ModalView>

      {/* <AlertModal
        visible={popupStatus}
        //visible={true}
        description={GLOBALS.Strings.playlist.complete_learning}
        onYesPress={() => {
          dispatch(AppActions.togglePopup(false))
          setTemp(temp + 1)
        }}
      /> */}
    </View>
  );
};
export default Home;

const Styles = StyleSheet.create({
  container: {
    height: "8%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    marginBottom: Platform.OS == "ios" ? RFValue(24) : RFValue(10),
    // backgroundColor: 'red'
    // borderWidth: 1,
    //backgroundColor: "#ffff",
  },
  mainView: {
    borderTopWidth: 0.5,
    borderColor: COLOR.BORDER_LIGHT,
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#ffff",
  },
  tabViewStyle: { flex: 0.3, justifyContent: "center", alignItems: "center" },
  activeTab: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(8),
    marginTop: RFValue(16),
  },
  activeTabPuls: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(8),
    marginTop: RFValue(16),
    backgroundColor: COLOR.DARK_GREEN,
    height: RFValue(44),
    width: RFValue(44),
    borderRadius: RFValue(22),
  },
  imageStyle: {
    height: RFValue(30),
    width: RFValue(30),
    // tintColor: COLOR.BLACK
  },
  chatImageStyle: {
    height: RFValue(35),
    width: RFValue(35),
  },
  trackerImageStyle: {
    height: RFValue(30),
    alignSelf: "center",
    width: RFValue(30),
  },
  textStyle: {
    color: COLOR.BLACK,
    paddingLeft: RFValue(5),
    paddingTop: RFValue(5),
    fontSize: RFValue(12),
    fontFamily: FONTS.REGULAR,
    fontWeight: "400",
  },
  bottomModal: {
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: RFValue(86),
    marginLeft: -RFValue(0),
  },
  content: {
    flex: 0.5,
    backgroundColor: COLOR.WHITE,
    borderTopLeftRadius: RFValue(10),
    borderTopRightRadius: RFValue(10),
    width: "100%",
    alignSelf: "flex-end",
  },
  touchableStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(10),
  },
  imageViewStyle: {
    flex: 0.1,
  },
  textViewStyle: {
    flex: 0.9,
    marginHorizontal: RFValue(10),
  },
  modalTextStyle: {
    color: COLOR.tabIcon,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
  },
  forwordImage: { height: RFValue(16), width: RFValue(16) },
  playImageStyle: {
    height: RFValue(28),
    width: RFValue(28),
  },
  modalHeading: {
    fontFamily: FONTS.BOLD,
    color: COLOR.tabIcon,
    fontSize: RFValue(17),
  },
});
