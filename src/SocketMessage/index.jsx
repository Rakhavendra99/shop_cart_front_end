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
        const toastId = Date.now()
        toast.success(socketObj?.message, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: () => { },
            onClick: () => this.navToaster(socketObj, toastId),
            toastId
        });

        const currentScreenId = window.location.pathname  
        console.log("currentScreenId", currentScreenId);
        if (socketObj?.type === "NEW_ORDER") {
            if (currentScreenId === "/orders") {
                window.location.reload();
            }
        }
    }

    navToaster(socketObj, toastId) {
        if(socketObj?.type === "NEW_ORDER"){
            this.props.history.push("/orders")
        }
    }

    render() {
        return <ToastContainer />
    }
}

export default (SocketMessage);
