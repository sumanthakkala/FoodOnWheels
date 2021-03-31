import React from 'react'
import './restaurants.css'
import { NavLink } from 'react-router-dom'

import * as dummyData from '../../data/dummyData'
import logo from '../../assets/images/burger-restaurant.jpg'; // with import

import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';



function Restaurants() {



    function getRestaurantsCards() {
        return (
            <div className="restaurantsCardsListContainer">
                {
                    dummyData.restaurantData.map((item) => {
                        return (

                            <div className="restaurantCard">
                                <div className="restaurantImageContainer">
                                    <img src={logo} className="restaurantImageDisplay" />
                                    <span>
                                        30 - 35 min
                                    </span>

                                    <div className="restaurantCardHoverOverlay">
                                        <EditIcon />
                                        <NavLink to="/restaurants/view" className="hoverBtn">
                                            <VisibilityIcon />
                                        </NavLink>

                                        <DeleteIcon />

                                    </div>
                                </div>
                                <div className="restaurantName">
                                    {item.name}
                                </div>



                            </div>
                        )
                    })
                }
            </div>
        )
    }




    return (
        <div className="container">
            <div className="cardsSection">
                <div className="row">
                    <p>
                        Restaurants
                    </p>
                    <NavLink to="/restaurants/add" className="button">Add New</NavLink>
                </div>
                {getRestaurantsCards()}
            </div>

        </div>
    )
}

export default Restaurants
