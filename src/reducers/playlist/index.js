/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";

const INITIAL_STATE = {
  playlistLoader: false,
  playlistDynamicLoader: false,
  isLoading: false,
};
const { ACTION_TYPE } = GLOBALS;
function playlistReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.GET_PLAYLIST_REQUEST:
      return Object.assign({}, state, {
        // playlistLoader: true,
        isLoading: true,
      });
    case ACTION_TYPE.GET_PLAYLIST_SUCCESS:
      return Object.assign({}, state, {
        // playlistLoader: false,
        isLoading: false,
        myPlaylist: action.payload,
      });
    case ACTION_TYPE.GET_PLAYLIST_FAIL:
      return Object.assign({}, state, {
        // playlistLoader: false
        isLoading: false,
      });

    case ACTION_TYPE.CHANGE_PLAYLIST_STATUS_REQUEST:
      return Object.assign({}, state, {
        // playlistLoader: true,
        isLoading: true,
      });
    case ACTION_TYPE.CHANGE_PLAYLIST_STATUS_SUCCESS:
      return Object.assign({}, state, {
        // playlistLoader: false,
        isLoading: false,
      });
    case ACTION_TYPE.CHANGE_PLAYLIST_STATUS_FAIL:
      return Object.assign({}, state, {
        //  playlistLoader: false
        isLoading: false,
      });

    case ACTION_TYPE.GET_PLAYLIST_DYNAMIC_REQUEST:
      return Object.assign({}, state, {
        // playlistDynamicLoader: true,
        isLoading: true,
      });
    case ACTION_TYPE.GET_PLAYLIST_DYNAMIC_SUCCESS:
      return Object.assign({}, state, {
        // playlistDynamicLoader: false,
        isLoading: false,
        playlistDynamicRes: action.payload,
      });
    case ACTION_TYPE.GET_PLAYLIST_DYNAMIC_FAIL:
      return Object.assign({}, state, {
        //  playlistDynamicLoader: false
        isLoading: false,
      });

    default:
      return state;
  }
}
export default playlistReducer;
