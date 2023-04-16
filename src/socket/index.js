import IO from 'socket.io-client';
import { BASE_URL_SOCKET_IO, SOCKET_IO_PATH } from '../util/Constants/constants';

let socket;


const destroySocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
/**
 * Start socket conection
 */
export const startSocketConnect = (callback, props) => {

  if (socket) {
    destroySocket()
  }
  // connect to socket
  socket = IO(BASE_URL_SOCKET_IO, {
    path: SOCKET_IO_PATH,
    autoConnect: true,
    forceNew: true,
    verify: true,
    //  timeout: 6000,
    //  connect_timeout: 3000,
    transports: ['websocket'],
    jsonp: false,
    // query: {
    //   authorization: token
    // },
  });
  socket.on('connect', val => {
    console.log('************ APP Connected ************');
  });
  socket.on('disconnect', () => {
    console.log('************ _onDisConnect ************');
  });
  socket.on('socket_connected', data => {
    console.log('************ socket_connected ************');
  });
  socket.on('socket_disconnected', data => {
    console.log('************ socket_disconnected ************');
  });

  socket.on('connect_error', data => {
    console.log('************ error ************', data);
  });
  socket.on('connect_timeout', data => {
    console.log('************ connect_timeout ************');
  });

  socket.on(
    `/SOCKET/VENDOR/${1}`,
    data => {
      console.log('------>>>> Socket notification', data);
      callback(data)
    })
}
/**
 * Stop socket conection
 */
export const token = () => {
  return {
  };
};
export const stopSocketConnect = () => {
  destroySocket()
};

