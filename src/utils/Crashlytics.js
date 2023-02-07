import crashlytics from '@react-native-firebase/crashlytics';

export const logEvent = (event) => {
    crashlytics().log(event);
    crashlytics().setUserId("testing")
}
export const customCrash = () => {
    crashlytics().crash()
}