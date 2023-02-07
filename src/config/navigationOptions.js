// @ts-nocheck
import { Navigation } from "react-native-navigation";
import { defaultNavigationStyle } from "@config/stackConfig";
export const navigatorPush = (props) => {
  const { componentId, screenName, passProps } = props;
  Navigation.push(componentId, {
    component: {
      name: screenName,
      passProps: passProps,
      options: defaultNavigationStyle(),
    },
  });
};
export const navigatorPop = (props) => {
  const { componentId } = props;
  Navigation.pop(componentId, props);
};
export const navigatorPopRoot = (props) => {
  const { componentId } = props;
  Navigation.popToRoot(componentId, props);
};
export const navigatorPopTo = (props) => {
  Navigation.popTo(props);
};
export const navigatorRoot = (screenName, passProps) => {
  Navigation.setRoot({
    root: {
      stack: {
        id: screenName,
        children: [
          {
            component: {
              name: screenName,
              options: defaultNavigationStyle(),
              passProps: passProps,
            },
          },
        ],
      },
    },
  });
};
export const navigatorReset = (props) => {
  const { componentId, screenName } = props;
  Navigation.setStackRoot(componentId, [
    {
      component: {
        name: screenName,
        options: defaultNavigationStyle(),
      },
    },
  ]);
};
export const navigatorListners = () => {
  Navigation.addListener("willFocus", (payload) => { });
};
