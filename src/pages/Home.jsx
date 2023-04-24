import React from "react"
import {  useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    return (
        <>
           
            <div className="menu_section">
                <div className="menu_section_content">
                    <h5 className="section_heading">Our Menu</h5>
                    <p className="fs-14 fs-12 fs-15 f-med mt-3 text-center">Enjoy daily changing, delicious chef-recommended meals created based on the food preferences shared by you.
                        Check out some of the dishes we cooked for our customers like you and feel free to try'em out!</p>
                    <img src={require(`../../src/asset/image/menu_img.png`)} className="menu_section_img" alt="menu_img" />
                    <button onClick={()=>navigate('/menu') } className="menu_section_btn">SEE MORE</button>
                </div>
            </div>
            <div className="work_section mt-5">
                <h5 className="section_heading">How it Works</h5>
                <div className="row work_section_content_start">
                    <div className="col-md-4 col-sm-12">
                        <div className=" work_section_content">
                            <div>
                                <img src={require(`../../src/asset/image/delivery.png`)} className="work_section_icon" alt="deliver_icon" />
                            </div>
                        </div>
                        <p className="fs-14 fs-12 fs-16 f-med mt-3 text-center">Choose food preference and personalise meal plans.</p>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className=" work_section_content">
                            <div>
                                <img src={require(`../../src/asset/image/delivery_food.png`)} className="work_section_icon" alt="deliver_icon" />
                            </div>
                        </div>
                        <p className="fs-14 fs-12 fs-16 f-med mt-3 text-center">Our chefs cook food freshly for you based on your chosen preferences.</p>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className=" work_section_content">
                            <div>
                                <img src={require(`../../src/asset/image/store.png`)} className="work_section_icon" alt="deliver_icon" />
                            </div>
                        </div>
                        <p className="fs-14 fs-12 fs-16 f-med mt-3 text-center">Food gets delivered fresh &amp; hot at scheduled timings.</p>
                    </div>
                </div>
            </div>

            {/* <div className="store_closed">
                <p className="store_closed_text fs-12 fs-16 fs-22 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, sint. Libero assumenda numquam iste sapiente debitis odio voluptatibus eius exercitationem!</p>
                <div className="d-flex justify-content-center">
                    <img src={require(`../../src/asset/image/store-closed.gif`)} alt ='' className="store_closed_gif"/>
                </div>
            </div> */}
        </>
    )
}
export default Home

