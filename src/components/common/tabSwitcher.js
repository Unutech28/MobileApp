import React, { Component, createContext } from "react";
import { TouchableOpacity } from "react-native";
const context = createContext({});
import GLOBALS from "@constants";
const { STRINGS } = GLOBALS;

const { Provider, Consumer } = context;
const Tab = ({ id, children, tabSelected, playModle, trackerIcon }) => {
  return (
    <Consumer>
      {({ changeTab }) => (
        <TouchableOpacity
          onModalItemPress={() => {}}
          onPress={() => {
            id == undefined ? null : changeTab(id);
            tabSelected();
            playModle();
            trackerIcon();
          }}
        >
          {children}
        </TouchableOpacity>
      )}
    </Consumer>
  );
};
const TabPanel = ({ whenActive, children }) => {
  return (
    <Consumer>
      {({ activeTabId }) => (activeTabId === whenActive ? children : null)}
    </Consumer>
  );
};
class TabSwitcher extends Component {
  state = {
    activeTabId: STRINGS.PLAYLIST,
  };
  changeTab = (newTabId) => {
    this.setState({
      activeTabId: newTabId,
    });
    // if (STRINGS.CHAT == newTabId) {
    //   alert("Coming soon..");
    // } else {
    //   this.setState({
    //     activeTabId: newTabId,
    //   });
    // }
  };
  render() {
    return (
      <Provider
        value={{
          activeTabId: this.state.activeTabId,
          changeTab: this.changeTab,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default TabSwitcher;
export { Tab, TabPanel };
