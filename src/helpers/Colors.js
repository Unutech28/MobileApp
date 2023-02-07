import { storeObj } from "@store/setup";
import GLOBALS from "@constants";

const themPrimaryColor = () => {
  setTimeout(() => {
    // if (storeObj.store.getState().authReducer.loginData.profile.activatedProg.primaryColor) {
    //     GLOBALS.COLOR.DARK_GREEN = storeObj.store.getState().authReducer.loginData.profile.activatedProg.primaryColor
    // } else {
    //     GLOBALS.COLOR.DARK_GREEN = "#6545B2"
    // }
    if (storeObj.store.getState().authReducer.primary) {
      GLOBALS.COLOR.DARK_GREEN = storeObj.store.getState().authReducer.primary;
    } else {
      GLOBALS.COLOR.DARK_GREEN = "#6545B2";
    }
  }, 2000);
};
const themSecondryColor = () => {
  setTimeout(() => {
    if (storeObj.store.getState().authReducer.secondary) {
      GLOBALS.COLOR.activeStepIconColor =
        storeObj.store.getState().authReducer.secondary;
      GLOBALS.COLOR.progressBarColor =
        storeObj.store.getState().authReducer.secondary;
      GLOBALS.COLOR.PRIMARY = storeObj.store.getState().authReducer.secondary;
    }
    // if (storeObj.store.getState().authReducer.loginData.profile.activatedProg.secondaryColor) {
    //     GLOBALS.COLOR.activeStepIconColor = storeObj.store.getState().authReducer.loginData.profile.activatedProg.secondaryColor
    //     GLOBALS.COLOR.progressBarColor = storeObj.store.getState().authReducer.loginData.profile.activatedProg.secondaryColor
    //     GLOBALS.COLOR.PRIMARY = storeObj.store.getState().authReducer.loginData.profile.activatedProg.secondaryColor
    // }
  }, 2000);
};

export { themPrimaryColor, themSecondryColor };
