/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import { isNonNullExpression } from 'typescript';
import { AsyncStorage } from 'react-native';
let { STRINGS } = GLOBALS;
const INITIAL_STATE = {
    bot_status: {},
    bot_welcome_data: {},
    bot_msg: [],
};

const { ACTION_TYPE } = GLOBALS;
function botReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ACTION_TYPE.BOT_STATUS:
            return {
                ...state,
                bot_status: action.payload,
            };
        case ACTION_TYPE.BOT_WELCOME:
            return {
                ...state,
                bot_welcome_data: action.payload,
            };
        case ACTION_TYPE.BOT_MESSAGES:
            return {
                ...state,
                bot_msg: [...state.bot_msg, action.payload],
            };

        default:
            return state;
    }
}
export default botReducer;