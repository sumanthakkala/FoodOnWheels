import React from 'react'
import './restaurants.css'
import { NavLink } from 'react-router-dom'

import * as dummyData from '../../data/dummyData'
import logo from '../../assets/images/burger-restaurant.jpg'; // with import

import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { IconButton } from '@material-ui/core';


function Restaurants() {


    const [fetchedRestaurants, setFetchedRestaurants] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://localhost:5000/api/restaurants`)
            .then(res => {
                setFetchedRestaurants(res.data)
            })
    }, [])


    const deleteRestaurantClicked = (_id) => {
        axios({
            method: "delete",
            url: 'http://localhost:5000/api/restaurants/' + _id,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                debugger
                //handle success
                fetchedRestaurants.splice(fetchedRestaurants.findIndex((item) => {
                    return item._id === _id
                }));
                setFetchedRestaurants([...fetchedRestaurants])
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }


    function getRestaurantsCards() {
        return (
            <div className="restaurantsCardsListContainer">
                {
                    fetchedRestaurants.map((item) => {
                        return (

                            <div className="restaurantCard">
                                <div className="restaurantImageContainer">
                                    <img src={item.photo} className="restaurantImageDisplay" />
                                    <span>
                                        {item.duration}
                                    </span>

                                    <div className="restaurantCardHoverOverlay">
                                        <EditIcon />
                                        <NavLink to="/restaurants/view" className="hoverBtn">
                                            <VisibilityIcon />
                                        </NavLink>

                                        <IconButton className="hoverBtn" onClick={() => deleteRestaurantClicked(item._id)}>
                                            <DeleteIcon />
                                        </IconButton>


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
