import React from 'react'
import './viewRestaurant.css'
import { FaChartPie, FaUserFriends, FaChartLine } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import logo from '../../assets/images/burger-restaurant.jpg';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


function ViewRestaurant() {


    function getRestaurantHeader() {
        return (
            <div className="headerContainer">
                <div className="headerInfo">
                    <p>
                        MrBeast Burger
                    </p>
                    {['Burger', 'Snack'].map((item) => (
                        <div className="tag">
                            {item}
                        </div>
                    ))}

                    {['Affordable', 'Fair Price'].map((item) => (
                        <div className="tag">
                            {item}
                        </div>
                    ))}
                </div>

                <div className="overviewContainer customOverview">


                    <div className="overviewTile">
                        <div className="row">
                            <div>
                                Revenue
                            </div>
                            <GiReceiveMoney />
                        </div>

                        <div>
                            $1621.89
                        </div>
                    </div>


                    <div className="overviewTile">
                        <div className="row">
                            <div>
                                Menu
                            </div>
                            <FaChartPie />
                        </div>

                        <div>
                            12
                        </div>
                    </div>





                    <div className="overviewTile">
                        <div className="row">
                            <div>
                                Orders
                            </div>
                            <FaChartLine />
                        </div>

                        <div>
                            504
                        </div>
                    </div>
                </div>

            </div>
        )
    }




    function getMenuList() {
        var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        return (
            <div className="menuContainer">
                <p>
                    Menu
                </p>
                <div className="menuListContainer">


                    <div className="menuCard">
                        <img src={logo} className="menuImage" />

                        <div className="menuItemDetailContainer">
                            <div className="row">
                                <div className="itemTitle">
                                    <TextField style={{ width: "100%" }} label="Item Name" />
                                </div>
                            </div>
                            <div className="caloriesAndPriceText">
                                <div className="itemPrice">
                                    <span>$</span>
                                    <TextField id="standard-basic" label="Price" />
                                </div>
                                <div className="caloriesText">
                                    <span>🔥</span>
                                    <TextField id="standard-basic" label="Calories" />
                                </div>
                            </div>

                            <div className="itemDescription">
                                <TextField style={{ width: "100%", marginBottom: '10px' }} label="Description" />
                            </div>

                            <div className="">
                                <Button variant="contained" className="button">
                                    Save
                                </Button>
                            </div>
                        </div>

                    </div>





                    {data.map((item) => (
                        <div className="menuCard">
                            <img src={logo} className="menuImage" />

                            <div className="menuItemDetailContainer">
                                <div className="row">
                                    <div className="itemTitle">
                                        Big Mac Burger
                                </div>


                                    <div className="itemPrice">
                                        $15.50
                                </div>
                                </div>
                                <div className="caloriesText">
                                    🔥 475 cal
                                </div>

                                <p className="itemDescription">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, dolor sit amet, consectetur adipiscing
                            </p>

                                <div className="menuCardActions">
                                    <Button variant="contained" color='secondary' onClick={removeBtnClicked}>
                                        Remove
                                </Button>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        )
    }

    const removeBtnClicked = () => {

    }



    return (
        <div className="container">
            {getRestaurantHeader()}
            {getMenuList()}
        </div>
    )
}

export default ViewRestaurant
