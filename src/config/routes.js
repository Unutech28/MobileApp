// @ts-nocheck
/* eslint-disable module-resolver/use-alias */
import withRedux from "@hoc/withRedux";
import { lazy } from "react";
import { Navigation } from "react-native-navigation";
import Loader from "@components/common/screenLoader";
const tabs = lazy(() => import("@components/common/tabBar.js"));
const WelcomeScreen = lazy(() => import("@containers/auth/welcomeScreen"));
const SignIn = lazy(() => import("@containers/auth/signIn"));
const Dashboard = lazy(() => import("@containers/dashboard"));
const NextDosage = lazy(() => import("@containers/dashboard/nextDosage"));
const Info = lazy(() => import("@containers/dashboard/info"));
const Points = lazy(() => import("@containers/dashboard/points"));
const CbtCourses = lazy(() => import("@containers/dashboard/info/cbtCourses"));
const Reminders = lazy(() => import("@containers/dashboard/reminders"));
const Playlist = lazy(() => import("@containers/dashboard/playlist"));
const Settings = lazy(() => import("@containers/dashboard/settings"));
const Chat = lazy(() => import("@containers/dashboard/chat"));
const Groups = lazy(() => import("@containers/dashboard/groups"));
const Journal = lazy(() => import("@containers/dashboard/journal"));
const JournalDetail = lazy(() =>
  import("@containers/dashboard/journal/journalDetail")
);
const Schedule = lazy(() => import("@containers/dashboard/schedule"));
const CareTeam = lazy(() => import("@containers/dashboard/careTeam"));
const Vidyo = lazy(() => import("@containers/dashboard/symptoms/videoCall"));
const AcceptVideoCall = lazy(() =>
  import("@containers/dashboard/acceptVideoCall")
);
const Symptoms = lazy(() => import("@containers/dashboard/symptoms"));
const Assessments = lazy(() => import("@containers/dashboard/assessments"));
const AssessmentDetail = lazy(() =>
  import("@containers/dashboard/assessments/assessmentDetail")
);
const Demo = lazy(() => import("@containers/dashboard/Demo"));
const DailyTracker = lazy(() => import("@containers/dashboard/dailyTracker"));
const SleepTracker = lazy(() =>
  import("@containers/dashboard/sleepTrackerNew")
);
const MoodTracker = lazy(() => import("@containers/dashboard/moodTracker"));
const SelectWeek = lazy(() => import("@containers/dashboard/selectweek"));
const SelectSection = lazy(() =>
  import("@containers/dashboard/selectSections")
);
const WeekInfoList = lazy(() =>
  import("@containers/dashboard/dailyLearningTemplates")
);
const ActivityTracker = lazy(() =>
  import("@containers/dashboard/activityTracker")
);
const AddOtherActivity = lazy(() =>
  import("@containers/dashboard/activityTracker/addOtherActivity")
);
const VoiceRecording = lazy(() =>
  import("@containers/dashboard/voiceRecording")
);

const Account = lazy(() => import("@containers/dashboard/Account"));
const Reports = lazy(() => import("@containers/dashboard/reports"));
const Help = lazy(() => import("@containers/dashboard/help"));
const VideoRecordingScreen = lazy(() =>
  import("@containers/dashboard/videoRecording")
);
const MoodGraph = lazy(() =>
  import("@containers/dashboard/moodTracker/moodGraph")
);
const SwipeCards = lazy(() => import("@containers/dashboard/swipeCards"));
const Chatbot = lazy(() => import("@containers/dashboard/chatbot"));
const HealthKit = lazy(() => import("@containers/dashboard/HealthKit"));
const ProgramList = lazy(() => import("@containers/dashboard/programsList"));
const UpdatePassword = lazy(() => import("@containers/auth/updatePassword"));
const ForgotPassword = lazy(() => import("@containers/auth/forgotPassword"));
const ResetPassword = lazy(() => import("@containers/auth/resetPassword"));
export const registerScreens = (store, Provider) => {
  const withReduxStore = withRedux(store);
  Navigation.registerComponentWithRedux(
    "Loader",
    () => Loader,
    Provider,
    store
  );
  Navigation.registerComponentWithRedux("SignIn", withReduxStore(SignIn));
  Navigation.registerComponentWithRedux(
    "ForgotPassword",
    withReduxStore(ForgotPassword)
  );
  Navigation.registerComponentWithRedux(
    "ResetPassword",
    withReduxStore(ResetPassword)
  );
  Navigation.registerComponentWithRedux("Tabs", withReduxStore(tabs));
  Navigation.registerComponentWithRedux("Dashboard", withReduxStore(Dashboard));
  Navigation.registerComponentWithRedux("Settings", withReduxStore(Settings));
  Navigation.registerComponentWithRedux(
    "NextDosage",
    withReduxStore(NextDosage)
  );
  Navigation.registerComponentWithRedux("Info", withReduxStore(Info));
  Navigation.registerComponentWithRedux("Points", withReduxStore(Points));
  Navigation.registerComponentWithRedux(
    "CbtCourses",
    withReduxStore(CbtCourses)
  );
  Navigation.registerComponentWithRedux("Reminders", withReduxStore(Reminders));
  Navigation.registerComponentWithRedux("Playlist", withReduxStore(Playlist));
  Navigation.registerComponentWithRedux("Chat", withReduxStore(Chat));
  Navigation.registerComponentWithRedux("Groups", withReduxStore(Groups));
  Navigation.registerComponentWithRedux("Journal", withReduxStore(Journal));
  Navigation.registerComponentWithRedux(
    "JournalDetail",
    withReduxStore(JournalDetail)
  );
  Navigation.registerComponentWithRedux(
    "NextDosage",
    withReduxStore(NextDosage)
  );
  Navigation.registerComponentWithRedux("Schedule", withReduxStore(Schedule));
  Navigation.registerComponentWithRedux("CareTeam", withReduxStore(CareTeam));
  Navigation.registerComponentWithRedux("Vidyo", withReduxStore(Vidyo));
  Navigation.registerComponentWithRedux(
    "AcceptVideoCall",
    withReduxStore(AcceptVideoCall)
  );
  Navigation.registerComponentWithRedux("Symptoms", withReduxStore(Symptoms));
  Navigation.registerComponentWithRedux("Demo", withReduxStore(Demo));
  Navigation.registerComponentWithRedux(
    "DailyTracker",
    withReduxStore(DailyTracker)
  );
  Navigation.registerComponentWithRedux(
    "SleepTracker",
    withReduxStore(SleepTracker)
  );
  Navigation.registerComponentWithRedux(
    "MoodTracker",
    withReduxStore(MoodTracker)
  );
  Navigation.registerComponentWithRedux("MoodGraph", withReduxStore(MoodGraph));
  Navigation.registerComponentWithRedux(
    "SelectWeek",
    withReduxStore(SelectWeek)
  );
  Navigation.registerComponentWithRedux(
    "SelectSection",
    withReduxStore(SelectSection)
  );
  Navigation.registerComponentWithRedux(
    "WeekInfoList",
    withReduxStore(WeekInfoList)
  );
  Navigation.registerComponentWithRedux(
    "ActivityTracker",
    withReduxStore(ActivityTracker)
  );
  Navigation.registerComponentWithRedux(
    "AddOtherActivity",
    withReduxStore(AddOtherActivity)
  );

  Navigation.registerComponentWithRedux(
    "VoiceRecording",
    withReduxStore(VoiceRecording)
  );

  Navigation.registerComponentWithRedux("Account", withReduxStore(Account));
  Navigation.registerComponentWithRedux("Reports", withReduxStore(Reports));
  Navigation.registerComponentWithRedux("Help", withReduxStore(Help));
  Navigation.registerComponentWithRedux(
    "VideoRecordingScreen",
    withReduxStore(VideoRecordingScreen)
  );
  Navigation.registerComponentWithRedux(
    "Assessments",
    withReduxStore(Assessments)
  );
  Navigation.registerComponentWithRedux(
    "AssessmentDetail",
    withReduxStore(AssessmentDetail)
  );
  Navigation.registerComponentWithRedux("MoodGraph", withReduxStore(MoodGraph));
  Navigation.registerComponentWithRedux(
    "SwipeCards",
    withReduxStore(SwipeCards)
  );
  Navigation.registerComponentWithRedux("Chatbot", withReduxStore(Chatbot));
  Navigation.registerComponentWithRedux("HealthKit", withReduxStore(HealthKit));
  Navigation.registerComponentWithRedux(
    "ProgramList",
    withReduxStore(ProgramList)
  );
  Navigation.registerComponentWithRedux(
    "UpdatePassword",
    withReduxStore(UpdatePassword)
  );
  Navigation.registerComponentWithRedux(
    "WelcomeScreen",
    withReduxStore(WelcomeScreen)
  );
};
