import React from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import logo from '../asset/image/shop_cart.png'
import cartIcon from '../asset/image/cart_icon.svg'
import { useSelector } from 'react-redux'
// import { getCartDetails } from "../../redux/reducer/CartReducer"

const Header = () => {
    const location = useLocation()
    // const cartDetails = useSelector({getCartDetails})

    return (
        <div className="leela_customer_header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid px-60 header_collapse">
                    <Link className="leela_logo navbar-brand me-0" to={'/'}><img src={logo} className="img-fluid " alt="" /></Link>
                    <div className="">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-expanded="false" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="text-end header_icons_mob d-flex">
                            {/* <div>
                                <img src={fbLogo} className="img-fluid header_icons cursor-pointer" onClick={()=>navFaceBook()} alt='' />
                            </div> */}
                            <div className="cart_header_part">
                                <Link to={'/cart'} > <img src={cartIcon} className="img-fluid header_icons" alt='' />
                                {/* {cartDetails?.CartItems?.length > 0 ? <p className="cart_item_count f-sbold">{cartDetails?.totalItems}</p> : ''} */}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="ms-lg-4 ms-2 collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link link-dark ${location.pathname === '/' ? 'active' : ''} sidebar_align`} aria-current="page" to={'/'}>Menu</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default Header