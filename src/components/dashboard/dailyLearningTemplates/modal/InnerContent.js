import React, { lazy } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { COLOR } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
} from "@components/dashboard/dailyLearningTemplates/templateElements";

const InnerrContent = (props) => {
  let { closeModal, innerContent,user_language } = props;
  return (
    <View style={styles.container}>
      <Header
        isMiddleIcon={true}
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          closeModal();
        }}
        isTitle={false}
        title={"g"}
        isLogout={false}
        titleStyle={{
          paddingTop: RFValue(10),
        }}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.outer_container}>
          <CardTitle
            style={tempStyle.cardTitle}
            text={innerContent.title ? innerContent.title[user_language]?innerContent.title[user_language]:innerContent.title["en"] : ""}
          />

          {innerContent && innerContent.image && innerContent.image != "" ? (
            <View style={[tempStyle.cardImageContainer]}>
              <ImageElement
                source={{ uri: innerContent.image }}
                resizeMode="contain"
                style={tempStyle.cardImage}
              />
            </View>
          ) : null}

          {innerContent.description && innerContent.description ? (
            <ShowHtmlText
              source={{
                html: innerContent?.description ?
                innerContent.description[user_language]?
                innerContent.description[user_language] : innerContent.description["en"]: '',
              }}
              
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default InnerrContent;

const styles = StyleSheet.create({
  outer_container: {
    padding: 20,
  },

  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
