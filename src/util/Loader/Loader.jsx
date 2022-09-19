import React from 'react';
import loader from "../../asset/image/loader.gif"

export default () => {
    return (
        <div className="">
             <div className="loaderAlign">
                <img width="50px" src={loader} alt="" /><br />
            </div>
        </div>
    )
}