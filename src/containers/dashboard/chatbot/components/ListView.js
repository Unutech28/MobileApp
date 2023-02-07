import React, {useState, lazy, useCallback, useEffect} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Images from '@images';
import {useSelector, useDispatch} from 'react-redux';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import GLOBALS from '@constants';
const {FONTS, COLOR, STRINGS} = GLOBALS;
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../styles';
import {strings} from '@localization';
const isiOS = Platform.OS == 'ios';
let window = Dimensions.get('window');

const {DARK_GREEN, WHITE, BACKGROUND, grayBlack, BLACK, grey_300} = COLOR;
/**Element for Image Loading */
const ListView = props => {
  let {
    isLeftIcon = false,
    onLeftIconClick = () => {},
    isTitle = false,
    topTitle = '',
    title = props.title,
    listType = props.type,
    suggestions = props.suggestions,
  } = props;
  // const article_list = [
  //   {
  //     id: 1,
  //     // cover: Images.stellaNurse1,
  //     cover:
  //       'https://i.picsum.photos/id/501/200/200.jpg?hmac=tKXe69j4tHhkAA_Qc3XinkTuubEWwkFVhA9TR4TmCG8',
  //     time: '3',
  //     level: 'Easy',
  //     title: 'Sweet potatoes with creamy  Avocados and pumpkin',
  //     discription:
  //       'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //     artist: 'Michael Jackson',
  //     songs: [
  //       {
  //         id: 1,
  //         cover:
  //           'https://i.picsum.photos/id/501/200/200.jpg?hmac=tKXe69j4tHhkAA_Qc3XinkTuubEWwkFVhA9TR4TmCG8',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Sweet potatoes with creamy  Avocados and pumpkin',
  //         discription:
  //           'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //         artist: 'Michael Jackson',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //       {
  //         id: 2,
  //         cover:
  //           'https://i.picsum.photos/id/669/201/201.jpg?hmac=spMhYb6tPA7hJX_Gs0OERKV6rfujcTiIQVvvO5SAytY',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Avocados and pumpkin',
  //         discription:
  //           'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //         artist: 'Michael Jackson',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     // cover: Images.botLoading,
  //     cover:
  //       'https://i.picsum.photos/id/669/201/201.jpg?hmac=spMhYb6tPA7hJX_Gs0OERKV6rfujcTiIQVvvO5SAytY',
  //     time: '3',
  //     level: 'Easy',
  //     title: 'Sweet potatoes  ',
  //     discription:
  //       'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //     artist: 'Shakira',
  //     songs: [
  //       {
  //         id: 1,
  //         // cover: Images.botLoading,
  //         cover:
  //           'https://i.picsum.photos/id/669/201/201.jpg?hmac=spMhYb6tPA7hJX_Gs0OERKV6rfujcTiIQVvvO5SAytY',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Sweet potatoes Shakira  ',
  //         discription:
  //           'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //         artist: 'Shakira',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     // cover: Images.stellaNurse1,
  //     cover:
  //       'https://i.picsum.photos/id/648/202/202.jpg?hmac=wd1lS9EiZ1UfvRC-SvplN1unx02SVBfjIFqQNomD60w',
  //     time: '3',
  //     level: 'Easy',
  //     title: 'Hello',
  //     artist: 'Christiana Angelina',
  //     songs: [
  //       {
  //         id: 1,
  //         cover:
  //           'https://i.picsum.photos/id/648/202/202.jpg?hmac=wd1lS9EiZ1UfvRC-SvplN1unx02SVBfjIFqQNomD60w',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Hello Angelina',
  //         artist: 'Christiana Angelina',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //       {
  //         id: 2,
  //         cover:
  //           'https://i.picsum.photos/id/969/203/203.jpg?hmac=22vzNoPv8v53jS2SqqDSveJmF2pfxpaLlg6SLLVT4KY',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Christiana',
  //         artist: 'Christiana Angelina',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //     ],
  //     discription:
  //       'Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //   },
  //   {
  //     id: 2,
  //     // cover: Images.botLoading,
  //     cover:
  //       'https://i.picsum.photos/id/969/203/203.jpg?hmac=22vzNoPv8v53jS2SqqDSveJmF2pfxpaLlg6SLLVT4KY',
  //     time: '3',
  //     level: 'Easy',
  //     title: 'Hello',
  //     artist: 'Michael Jackson',
  //     songs: [
  //       {
  //         id: 1,
  //         cover:
  //           'https://i.picsum.photos/id/648/202/202.jpg?hmac=wd1lS9EiZ1UfvRC-SvplN1unx02SVBfjIFqQNomD60w',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'MonoPhase',
  //         artist: 'Michael Jackson',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //       {
  //         id: 2,
  //         cover:
  //           'https://i.picsum.photos/id/969/203/203.jpg?hmac=22vzNoPv8v53jS2SqqDSveJmF2pfxpaLlg6SLLVT4KY',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Hello 123',
  //         artist: 'Michael Jackson',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //       {
  //         id: 3,
  //         cover:
  //           'https://i.picsum.photos/id/501/200/200.jpg?hmac=tKXe69j4tHhkAA_Qc3XinkTuubEWwkFVhA9TR4TmCG8',
  //         time: '3',
  //         level: 'Easy',
  //         title: 'Michael',
  //         artist: 'Michael Jackson',
  //         song: 'https://www.kozco.com/tech/LRMonoPhase4.mp3',
  //       },
  //     ],
  //     discription:
  //       ' Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkinSweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin Sweet potatoes with creamy  Avocados and pumpkin',
  //   },
  // ];

  return (
    <View
      style={[
        {
          backgroundColor: 'transparent',
          marginTop: 0,
          padding: 10,
          width: '100%',
        },
      ]}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>{title}</Text>
      </View>
      <FlatList
        data={suggestions}
        // data={article_list}
        keyExtractor={(item, index) => String(index)}
        numColumns={2}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => props.onItemSelect(item)}
              style={[styles.touchableStyle, globalStyles.boxShadow1, {}]}>
              <View style={{width: '100%'}}>
                <Image
                  style={{
                    borderRadius: 5,
                    height: RFValue(110),
                    width: '100%',
                  }}
                  source={{
                    uri: `${GLOBALS.IMAGE_BASE_URL}${item.icon}`,
                  }}
                  // source={{uri: item.cover}}
                  resizeMode="cover"
                />
                <Text numberOfLines={3} style={styles.itemTitle}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
    // <View
    //   style={[
    //     globalStyles.touchableStyle,
    //     globalStyles.boxShadow,
    //     {flexDirection: 'column'},
    //     globalStyles.bottomContainer,
    //      {left: RFValue(0), height: RFValue(250)},
    //   ]}>
    //   <View style={styles.headingContainer}>
    //     <Text style={styles.headingText}>{title}</Text>
    //   </View>
    //   <FlatList
    //     data={article_list}
    //     keyExtractor={index => index}
    //     numColumns={2}
    //     renderItem={({item}) => {
    //       return (
    //         <TouchableOpacity
    //           onPress={() => {
    //             props.onPres();
    //             props.data(item);
    //           }}
    //           style={[styles.listConstainer, globalStyles.boxShadow]}>
    //           <View>
    //             <Image
    //               style={{height: RFValue(100), width: '100%'}}
    //               source={{uri: item.cover}}
    //               resizeMode="cover"
    //             />
    //           </View>
    //           {props.type != 'music' && (
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 alignItems: 'space-between',
    //                 flex: 1,
    //                 paddingTop: RFValue(5),
    //                 paddingHorizontal: RFValue(5),
    //               }}>
    //               <View style={{flex: 1, flexDirection: 'row'}}>
    //                 <MaterialIcons
    //                   style={{bottom: 2}}
    //                   name="alarm"
    //                   size={RFValue(15)}
    //                   color={COLOR.chatText}
    //                 />
    //                 <Text style={styles.article_top_row}>
    //                   {item.time + ' ' + strings?.chatBot?.minutes}
    //                 </Text>
    //               </View>
    //               <View style={{flex: 1, flexDirection: 'row'}}>
    //                 <AntDesign
    //                   style={{bottom: 2}}
    //                   name="like2"
    //                   size={RFValue(15)}
    //                   color={COLOR.chatText}
    //                 />
    //                 <Text style={styles.article_top_row}>{item.level}</Text>
    //               </View>
    //             </View>
    //           )}

    //           <View style={{paddingHorizontal: RFValue(2)}}>
    //             <Text numberOfLines={2} style={styles.itemTitle}>
    //               {props.type == 'music' ? item.artist : item.title}
    //             </Text>
    //             {props.type == 'music' && (
    //               <Text
    //                 numberOfLines={1}
    //                 style={[
    //                   styles.article_top_row,
    //                   {paddingBottom: RFValue(5), fontSize: RFValue(15)},
    //                 ]}>
    //                 {item.songs.length + ' ' + strings?.chatBot?.songs}
    //               </Text>
    //             )}
    //           </View>
    //         </TouchableOpacity>
    //       );
    //     }}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  listConstainer: {
    // backgroundColor: 'yellow',
    width: RFValue(120),
    borderColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    margin: RFValue(5),
  },
  article_top_row: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(11),
    paddingLeft: RFValue(2),
  },
  headingContainer: {
    // justifyContent: 'flex-start',
    width: '90%',
    paddingVertical: RFValue(5),
    marginBottom: RFValue(10),
    borderBottomWidth: 1,
    borderColor: grey_300,
    // backgroundColor: 'red',
    // flexDirection: 'row',
  },
  headingText: {
    color: BLACK,
    fontSize: RFValue(18),
    fontFamily: FONTS.BOLD,
    marginLeft: RFValue(5),
  },
  itemTitle: {
    color: BLACK,
    fontSize: RFValue(13),
    fontFamily: FONTS.REGULAR,
    padding: RFValue(5),
  },
  touchableStyle: {
    width: '43%',
    // flexDirection: 'row',
    //paddingHorizontal: RFValue(10),
    // paddingLeft: RFPercentage(1),
    borderWidth: 0.2,
    borderColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    margin: RFValue(3),
    //  minHeight: RFValue(40),
    // alignItems: 'flex-start',
    alignItems: 'center',
    //flexWrap: 'wrap',
    //  justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});

export {ListView};
