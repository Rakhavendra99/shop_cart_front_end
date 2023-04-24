import moment from 'moment'
const Footer = () => {
    return (
        <>
            <div className="footer_bottom">
                <p className="m-0 fs-12">Copyright ©{moment().format('yyyy')} Shop Cart. All Rights Reserved by Shop Cart</p>
            </div>
        </>
    )
}
export default Footer