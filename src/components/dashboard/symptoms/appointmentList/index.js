import CardView from "@components/dashboard/symptoms/cardView";
import GLOBALS from "@constants";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import { strings } from '@localization';
function AppointmentList(props) {
  let {
    appointmentData,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    activeTab,
    appointmentLoader,
    goToVideoCall,
  } = props;

  return (
    <View style={{ flexGrow: 1 }}>
      {appointmentLoader ? (
        <Loader loaderColor={"#000"} />
      ) : (
        appointmentData && appointmentData !== null ? (
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={appointmentData}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingAppointmentList}
                onRefresh={() => onRefreshAppointmentList(activeTab, true)}
              />
            }
            renderItem={({ item, index }) => (
              <CardView
                id={index}
                item={item}
                onClick={() => {}}
                goToVideoCall={goToVideoCall}
                activeTab={activeTab}
              />
            )}
            ListEmptyComponent={<NoData emptyTextMessage={strings.Schedule.NO_APPOINTMENTS} />}
          />
        )
        :
        <NoData emptyTextMessage={strings.Schedule.NO_APPOINTMENTS} />
      )}
    </View>
  );
}

export default (AppointmentList = React.memo(AppointmentList));
