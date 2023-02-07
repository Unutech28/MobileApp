export function defaultNavigationStyle() {
  return {
    popGesture: false,
    statusBar: {
      visible: true,
      style: 'light',
      hideWithTopBar: false,
      blur: false,
    },
    topBar: {
      visible: false,
      height: 0,
    },
    animations: {
      push: {
        waitForRender: true,
      },
    },
    navigationOptions: {
      gesturesEnabled: false,
    }
  };
}
