import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import globalStyles from '../styles';
import { Header } from './Header';
import { RFValue } from 'react-native-responsive-fontsize';
import { Slider } from '@miblanchard/react-native-slider'
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import GLOBALS from '@constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/AntDesign';
import RenderHtml from 'react-native-render-html';
import {
  getYoutubeId,
  minutesAndSeconds,
} from '../../../../components/dashboard/dailyLearningTemplates/utilities';
import { strings } from '@localization';
const { COLOR, FONTS } = GLOBALS;
const { grayBlack, BLACK, grey_300 } = COLOR;
const ShowArticalSongs = props => {
  const [isPlayingAudio, togglePlayAudio] = useState(false);
  const [totalLength, setTotalLength] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const elapsed = minutesAndSeconds(currentPosition);
  const remaining = minutesAndSeconds(totalLength - currentPosition);
  const audioPlayer = React.useRef();

  const article_list = [
    {
      id: 1,
      // cover: Images.stellaNurse1,
      cover:
        'https://i.picsum.photos/id/501/200/200.jpg?hmac=tKXe69j4tHhkAA_Qc3XinkTuubEWwkFVhA9TR4TmCG8',
      time: '3',
      level: 'Easy',
      title: 'Sweet potatoes with creamy  Avocados and pumpkin',
      discription:
        'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
      artist: 'Michael Jackson',
      songs: [{ id: 1 }],
    },
    {
      id: 2,
      // cover: Images.botLoading,
      cover:
        'https://i.picsum.photos/id/669/201/201.jpg?hmac=spMhYb6tPA7hJX_Gs0OERKV6rfujcTiIQVvvO5SAytY',
      time: '3',
      level: 'Easy',
      title: 'Sweet potatoes  ',
      discription:
        'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
      artist: 'Michael Jackson',
      songs: [{ id: 1 }, { id: 1 }],
    },
    {
      id: 1,
      // cover: Images.stellaNurse1,
      cover:
        'https://i.picsum.photos/id/648/202/202.jpg?hmac=wd1lS9EiZ1UfvRC-SvplN1unx02SVBfjIFqQNomD60w',
      time: '3',
      level: 'Easy',
      title: 'Hello',
      artist: 'Michael Jackson',
      songs: [{ id: 1 }, { id: 1 }],
      discription:
        'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
    },
  ];

  const handleControl = (type, index) => {
    setCurrentPosition(0);
    switch (type) {
      case 'play':
        setSelectedIndex(index);
        togglePlayAudio(true);
        if (totalLength == currentPosition) {
          audioPlayer.current.seek(0);
        }
        break;
      case 'pause':
        setSelectedIndex(index);
        togglePlayAudio(false);

        if (totalLength == currentPosition) {
          audioPlayer.current.seek(0);
        }
        break;
      default:
        break;
    }
  };

  const setDuration = data => {
    setTotalLength(Math.floor(data?.duration));
  };

  const setTime = data => {
    setCurrentPosition(Math.floor(data?.currentTime));
    if (totalLength == Math.floor(data?.currentTime)) {
      // audioPlayer.current.seek(0);
      togglePlayAudio(false);
    }
  };

  const seek = time => {
    time = Math.round(time);
    audioPlayer.current && audioPlayer.current.seek(time);
    setCurrentPosition(time);
    togglePlayAudio(true);
  };

  const { item, type, onBackPress } = props;
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header
          onLeftIconClick={() => {
            onBackPress();
          }}
          topTitle="Setting Up Chat"
          title="Get to know you better"
          isMiddleIcon={true}
          isLeftIcon={true}
          isTitle={true}
        />
      </View>

      <TouchableOpacity onPress={onBackPress} style={styles.backPressContainer}>
        <Ionicons name="chevron-back" size={RFValue(25)} color={grayBlack} />
        <Text style={styles.article_top_Title}>
          {item.type != 'music' ? item.title : item.title}
        </Text>
      </TouchableOpacity>

      {item.type != 'music' ? (
        //UI for Articals
        <ScrollView>
          <View style={styles.innerContainer}>
            <View style={[styles.listConstainer, globalStyles.boxShadow]}>
              <View>
                <Image
                  style={styles.coverImg}
                  // source={{ uri: item.cover }}
                  source={{
                    uri: `${GLOBALS.IMAGE_BASE_URL}${item.icon}`,
                  }}
                  resizeMode="stretch"
                />
              </View>

              {/* <View style={styles.iconContainer}>
                <View style={styles.iconTextContainer}>
                  <MaterialIcons
                    style={{ bottom: 2 }}
                    name="alarm"
                    size={RFValue(18)}
                    color={COLOR.chatText}
                  />
                  <Text style={styles.article_top_row}>
                  {item.time + " " + strings?.chatBot?.minutes}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <AntDesign
                    style={{ bottom: 2 }}
                    name="like2"
                    size={RFValue(18)}
                    color={COLOR.chatText}
                  />
                  <Text style={styles.article_top_row}>{item.level}</Text>
                </View>
              </View> */}
              <View style={{ paddingHorizontal: RFValue(10) }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {/* <Text style={styles.itemDescription}>{item.description}</Text> */}
                <RenderHtml
                  source={{
                    html: item.description,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        //UI for play songs
        <FlatList
          data={item.songs}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.songsContainer}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  {index == selectedIndex && (
                    <Video
                      source={{
                        uri:
                          'https://stella-careportal.curio-dtx.com/upload/Introduction.mp4',
                      }}
                      //onError={err => console.log('errorr')}
                      // onBuffer={err => console.log('errorr')}
                      ref={ref => (audioPlayer.current = ref)}
                      audioOnly={true}
                      style={styles.audioElement}
                      //  playInBackground={true}
                      //  playWhenInactive={true}
                      paused={!isPlayingAudio}
                      // poster={
                      //   'https://stella-careportal.curio-dtx.com/upload/video-icon-thumbnail.jpg'
                      // }
                      resizeMode="cover" // Fill the whole screen at aspect ratio.
                      repeat={false} // Repeat forever.
                      onLoad={setDuration}
                      onProgress={setTime} // Callback every ~250ms with currentTime
                    // source={{
                    //   uri: item.musicURL,
                    // }}
                    />
                  )}
                  <View>
                    <Image
                      style={styles.coverImgSong}
                      // source={{uri: item.cover}}
                      source={{
                        uri: 'http://13.89.37.31:4002/upload/cover.jpeg',
                      }}
                      resizeMode="stretch"
                    />
                    <View style={styles.playButton}>
                      {/* <TouchableOpacity
                        style={styles.playButtonView}
                        onPress={() => handleControl("play", index)}
                      >
                        <Icon
                          size={30}
                          name={
                            isPlayingAudio && index == selectedIndex
                              ? "pausecircle"
                              : "play"
                          }
                          resizeMode="contain"
                        />
                      </TouchableOpacity> */}
                      {isPlayingAudio && index == selectedIndex ? (
                        <TouchableOpacity
                          style={styles.playButtonView}
                          onPress={() => handleControl('pause', index)}>
                          <Icon
                            size={30}
                            name={'pausecircle'}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.playButtonView}
                          onPress={() => handleControl('play', index)}>
                          <Icon size={30} name={'play'} resizeMode="contain" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      width: '75%',
                      justifyContent: 'center',
                      marginLeft: RFValue(5),
                    }}>
                    <Text style={styles.article_top_Title}>{item.name}</Text>
                    {index == selectedIndex ? (
                      <View style={{ width: '90%' }}>
                        <Slider
                          onSlidingStart={() => togglePlayAudio(false)}
                          onSlidingComplete={seek}
                          trackStyle={styles.track}
                          value={currentPosition}
                          maximumTrackTintColor={COLOR.progressBarColor}
                          minimumTrackTintColor={COLOR.PRIMARY}
                          thumbStyle={styles.thumb}
                          // maximumValue={4}
                          maximumValue={Math.max(
                            totalLength,
                            1,
                            currentPosition + 1,
                          )}
                          animateTransitions={true}
                        />
                        <View style={styles.audioCOntaine}>
                          <Text style={[styles.audioTime]}>
                            {elapsed[0] + ':' + elapsed[1]}
                          </Text>

                          <Text style={[styles.audioTime]}>
                            {totalLength > 1 &&
                              '-' + remaining[0] + ':' + remaining[1]}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listConstainer: {
    width: '90%',
    borderColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    margin: RFValue(5),
    backgroundColor: 'red',
  },
  article_top_row: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    paddingLeft: RFValue(5),
  },
  headingContainer: {
    justifyContent: 'flex-start',
    width: '90%',
    paddingVertical: RFValue(5),
    marginLeft: RFValue(2),
    marginBottom: RFValue(5),
    borderBottomWidth: 1,
    borderColor: grey_300,
  },
  headingText: {
    color: COLOR.BLACK,
    fontSize: RFValue(18),
    fontFamily: FONTS.BOLD,
    marginLeft: RFValue(10),
  },
  itemTitle: {
    color: COLOR.BLACK,
    fontSize: RFValue(19),
    fontFamily: FONTS.BOLD,
    paddingVertical: RFValue(10),
  },
  itemDescription: {
    color: COLOR.BLACK,
    fontSize: RFValue(15),
    fontFamily: FONTS.REGULAR,
    paddingVertical: RFValue(5),
  },
  article_top_Title: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(17),
    paddingHorizontal: RFValue(10),
    color: BLACK,
  },
  backPressContainer: {
    flexDirection: 'row',
    marginTop: RFValue(20),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: grey_300,
    marginHorizontal: RFValue(20),
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: RFValue(20),
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: RFValue(20),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: RFValue(5),
  },
  coverImg: { height: RFValue(350), width: '100%' },
  iconTextContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: RFValue(10),
  },
  coverImgSong: {
    height: RFValue(80),
    width: RFValue(70),
    borderRadius: RFValue(10),
    // backgroundColor: "red",
  },
  audioElement: {
    height: 0,
    width: 0,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
  },
  audioCOntaine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  track: {
    height: 5,
    marginHorizontal: 5,
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.LIGHT_SHADOW_GREEN,
    borderWidth: 2,
    shadowColor: COLOR.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  songsContainer: {
    width: '90%',
    marginTop: RFValue(5),
    marginHorizontal: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: grey_300,
    paddingVertical: RFValue(10),
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: RFValue(30),
  },
  playButtonView: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
export default ShowArticalSongs;
