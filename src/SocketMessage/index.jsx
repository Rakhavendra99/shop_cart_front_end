import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { startSocketConnect } from '../socket';

class SocketMessage extends React.Component {
    componentDidMount() {
        this._initiateSocket()
    }

    _initiateSocket() {
        startSocketConnect((socket) => {
            this.showToastMessage(socket);
        })
    }


    showToastMessage(socketObj) {
        // this.props.chatMessage()
        const toastId = Date.now()
        toast.success(socketObj?.message, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: () => { },
            onClick: () => this.navToaster(socketObj, toastId),
            toastId
        });
    }

    navToaster(socketObj, toastId) {

    }

    render() {
        return <ToastContainer />
    }
}

export default (SocketMessage);
