import SocketIO from 'socket.io-client';
import GLOBALS from '../constants';
const { URL } = GLOBALS;
export default {
  initialize() {
    const options = {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      jsonp: false,
      //      transports: ['websocket']
    };

    return SocketIO(URL.SOCKET_URL, options);
  },
};
