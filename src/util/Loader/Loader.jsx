import React from 'react';
import loader from "../../asset/image/loader.gif"

const Loader = ({ size = '80px' }) => {
    return (<div><div className="modal d-block" id="loader" tabIndex="-1" aria-labelledby="loader" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">

                <div className="modal-body text-center">

                    <h2 className="font26 fw-normal breathe">Loading</h2>

                    <img src={loader} alt="loading..." />
                </div>

            </div>
        </div>
    </div>
        <div className="modal-backdrop show"></div></div>)
}

export default Loader;