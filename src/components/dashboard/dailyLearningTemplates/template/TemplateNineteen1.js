import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import ButtonNew from '@components/common/buttonNew';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider'
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from '@actions';
// import convertToProxyURL from 'react-native-video-cache';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
function TemplateNineteen1(props) {
  let { cardData, onLikeClick, onCommentClick, user_language } = props;
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(1);
  const videoPlayer = React.useRef();
  const dispatch = useDispatch();
  const onCommentPress = () => { };

  const content = [
    {
      content: `If I like my newborn, then<strong> I must always</strong> want to
            be with them`,

      type: 'first',
    },
    {
      content: `<span data-contrast="none">"As a mother,&nbsp;</span>
            <strong>
              <span data-usefontface="false" data-contrast="none">
                I must always
              </span>
            </strong>
            <span data-contrast="none">
              &nbsp;be available for my baby.&ldquo;
            </span>`,
      type: 'first',
    },
    {
      content:
        "Good mothers <strong>always </strong>put their baby's needs first.",
      type: 'first',
    },
    {
      content: `<span
              class="TextRun SCXP209497250 BCX0"
              lang="EN-US"
              data-scheme-color="@000000,1,"
              data-usefontface="false"
              data-contrast="none">
              <span class="NormalTextRun SCXP209497250 BCX0">
                "If I want to be a good mom, I
              </span>
            </span>
            <span
              class="TextRun MacChromeBold SCXP209497250 BCX0"
              lang="EN-US"
              data-scheme-color="@000000,1,"
              data-usefontface="false"
              data-contrast="none">
              <span class="NormalTextRun SCXP209497250 BCX0">should&nbsp;</span>
            </span>
            <span
              class="TextRun SCXP209497250 BCX0"
              lang="EN-US"
              data-scheme-color="@000000,1,"
              data-usefontface="false"
              data-contrast="none">
              <span class="NormalTextRun SCXP209497250 BCX0">
                <strong>always </strong>know what my baby&nbsp;
              </span>
            </span>
            <span
              class="TextRun SCXP209497250 BCX0"
              lang="EN-US"
              data-scheme-color="@000000,1,"
              data-usefontface="false"
              data-contrast="none">
              <span class="NormalTextRun SCXP209497250 BCX0">
                needs."&nbsp;
              </span>
            </span>
            <span class="EOP SCXP209497250 BCX0">​</span>
         `,
      type: 'first',
    },
    {
      content: `
            <span
              class="TextRun SCXP11531203 BCX0"
              lang="EN-US"
              data-contrast="none">
              <span class="NormalTextRun SCXP11531203 BCX0">
                "If I'm a good mother,
              </span>
            </span>
            <span
              class="TextRun MacChromeBold SCXP11531203 BCX0"
              lang="EN-US"
              data-usefontface="false"
              data-contrast="none">
              <span class="NormalTextRun SCXP11531203 BCX0">
                I <strong>have to</strong>
              </span>
            </span>
            <span
              class="TextRun SCXP11531203 BCX0"
              lang="EN-US"
              data-contrast="none">
              <span class="NormalTextRun SCXP11531203 BCX0">
               
                be able to put my newborn to sleep.&ldquo;
              </span>
            </span>
            <span class="EOP SCXP11531203 BCX0">​</span>
          `,
      type: 'first',
    },
    {
      content: ` <p>
          Also, if you often feel frustrated and guilty for failing to
          accomplish what you set out to do, your
          <strong>
            expectations may be unrealistic, or you may be being hard on
            yourself
          </strong>
          .&nbsp;
        </p>`,
      type: 'second',
    },
  ];

  return (
    <View
      style={[
        tempStyle.outerContainer,
        cardData.webUrl ? { paddingHorizontal: 0 } : null,
        Platform.OS == 'android'
          ? { minHeight: height / 1.5, backgroundColor: 'white' }
          : null,
      ]}>
      {/* <View style={{}}>
        {cardData?.card_title != '' && (
          <CardTitle
            style={tempStyle?.cardTitle}
            text={
              cardData?.card_title
                ? cardData.card_title[user_language]
                  ? cardData.card_title[user_language]
                  : cardData.card_title['en']
                : ''
            }
          />
        )}

        {cardData.description ? (
          <ShowHtmlText
            contentWidth={width}
            source={{
              html: cardData?.description
                ? cardData.description[user_language]
                  ? cardData.description[user_language]
                  : cardData.description['en']
                : '',
            }}
          />
        ) : null}
      </View> */}

      <View style={{}}>
        <CardTitle
          style={tempStyle?.cardTitle}
          text={'Unrealistic Expectations'}
        />

        <ShowHtmlText
          source={{
            html:
              'Expectations are usually unrealistic when they are too rigid and inflexible (expressions like "always", "never", "should" or "must"). See the examples described below:',
          }}
        />
      </View>
      <View style={[tempStyle.cardImageContainer, { marginTop: RFValue(10) }]}>
        {cardData?.image ? (
          <ImageElement
            resizeMethod="resize"
            source={{
              uri: cardData?.image,
            }}
            resizeMode={cardData?.isFreeSizeImage ? 'contain' : 'cover'}
            style={[
              cardData?.isFreeSizeImage
                ? styles.cardImageforFreeSize
                : tempStyle.cardImage,
              {
                minHeight: 220,
                overflow: 'hidden',
              },
            ]}
            isLoad={true}
          />
        ) : null}
      </View>
      <View style={{ marginLeft: RFValue(20) }}>
        {content.map(item => {
          if (item.type == 'first')
            return (
              <View style={{ marginTop: RFValue(15) }}>
                <ShowHtmlText
                  source={{
                    html: item?.content,
                  }}
                />
              </View>
            );
        })}
      </View>
      <View>
        {content.map(item => {
          if (item.type == 'second')
            return (
              <View style={{ marginTop: RFValue(5) }}>
                <ShowHtmlText
                  source={{
                    html: item?.content,
                  }}
                />
              </View>
            );
        })}
      </View>
      <LikeElement
        cardDetails={cardData}
        onLikeClick={type => {
          onLikeClick({
            card_id: cardData?._id,
            like: type,
          });
        }}
        onCommentClick={() => {
          onCommentPress();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  cardImageContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: RFValue(10),
    justifyContent: 'center',
  },
  cardImage: {
    borderRadius: RFValue(10),
    width: '100%',
    minHeight: RFValue(190),
    maxHeight: RFValue(200),
    borderRadius: RFValue(10),
  },
  cardImageforFreeSize: {
    borderRadius: RFValue(10),
    width: '100%',
    height: '100%',
    borderRadius: RFValue(10),
  },
});
export default (TemplateNineteen1 = React.memo(TemplateNineteen1));
