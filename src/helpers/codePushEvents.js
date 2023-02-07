// import CodePush from "react-native-code-push";
import { alertWithOneBtn } from "@helpers/common";
import GLOBALS from "@constants";
import { Platform, NativeModules } from 'react-native';
/** Update pops a confirmation dialog, and then immediately reboots the app */
export const syncImmediate = () => {
    // CodePush.sync(
    //     {
    //         deploymentKey: Platform.OS == 'android' ? GLOBALS.Strings.codePushiOSStaging : GLOBALS.Strings.codePushiOSStaging,
    //         installMode: CodePush.InstallMode.ON_NEXT_RESTART,
    //         updateDialog: {
    //             title: GLOBALS.Strings.alert_text,
    //             optionalUpdateMessage: GLOBALS.Strings.updateMsg
    //         }
    //     },
    //     codePushStatusDidChange.bind(this),
    // );
}
// const codePushStatusDidChange = (syncStatus) => {
//     switch (syncStatus) {
//         case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
//             break;
//         case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
//             break;
//         case CodePush.SyncStatus.AWAITING_USER_ACTION:
//             break;
//         case CodePush.SyncStatus.INSTALLING_UPDATE:
//             break;
//         case CodePush.SyncStatus.UP_TO_DATE:
//             break;
//         case CodePush.SyncStatus.UPDATE_IGNORED:
//             break;
//         case CodePush.SyncStatus.UPDATE_INSTALLED:
//             alertWithOneBtn(GLOBALS.Strings.updateSuccessTitle, GLOBALS.Strings.updateSuccessmsg).then(res => {
//                 Platform.OS == 'ios' ? CodePush.restartApp() :
//                     setTimeout(() => {
//                         CodePush.restartApp()
//                     }, 1000)

//             })
//             break;
//         case CodePush.SyncStatus.UNKNOWN_ERROR:
//             break;
//     }
// }