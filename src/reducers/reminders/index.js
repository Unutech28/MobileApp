/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';

const INITIAL_STATE = {
  reminderLoader: false,
  remindersList: [],
};
const {ACTION_TYPE} = GLOBALS;
function reminderReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.GET_REMINDER_REQUEST:
      return Object.assign({}, state, {
        reminderLoader: true,
      });
    case ACTION_TYPE.GET_REMINDER_SUCCESS:
      return Object.assign({}, state, {
        reminderLoader: false,
        morningReminder: filterReminder(action.payload, 'getMorning'),
        afternoonReminder: filterReminder(action.payload, 'getAfternoon'),
        eveningReminder: filterReminder(action.payload, 'getEvening'),
      });
    case ACTION_TYPE.GET_REMINDER_FAIL:
      return Object.assign({}, state, {reminderLoader: false});
    default:
      return state;
  }
}
export default reminderReducer;

filterReminder = (redminders, reminderType) => {
  const reminder = redminders && redminders[0];
  if (reminderType == 'getMorning') {
    return reminder.morning;
  } else if (reminderType == 'getAfternoon') {
    return reminder.afternoon;
  } else {
    return reminder.evening;
  }
};
