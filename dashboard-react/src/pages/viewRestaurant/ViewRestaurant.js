import React from 'react'
import './viewRestaurant.css'
import { FaChartPie, FaUserFriends, FaChartLine } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import logo from '../../assets/images/burger-restaurant.jpg';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { IconButton } from '@material-ui/core';
import axios from 'axios';
import { useParams } from 'react-router';

function ViewRestaurant() {

    const { restaurantId } = useParams()

    const [fetchedRestaurantDetails, setFetchedRestaurantDetails] = React.useState({})
    const [fetchedCategories, setFetchedCategories] = React.useState([])
    const [selectedMenuItemImage, setSelectedMenuItemImage] = React.useState(null);
    const [selectedMenuItemImageAsURL, setSelectedMenuItemImageAsURL] = React.useState(null);
    const [itemName, setItemName] = React.useState("")
    const [calories, setCalories] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [description, setDescription] = React.useState("")


    React.useEffect(() => {
        axios.get(`http://localhost:5000/api/restaurants/` + restaurantId)
            .then(res => {
                setFetchedRestaurantDetails(res.data)
            })

        axios.get(`http://localhost:5000/api/categories`)
            .then(res => {
                setFetchedCategories(res.data)
            })
    }, [])


    const handleImageChange = (e) => {
        setSelectedMenuItemImage(e.target.files[0])
        // setIsImageChanged(true)
        setSelectedMenuItemImageAsURL(URL.createObjectURL(e.target.files[0]))
    }


    function getPriceRatingTag(rating) {
        switch (rating) {
            case 1:
                return (
                    <div className="tag">
                        Affordable
                    </div>
                )
                break;
            case 2:
                return (
                    <div className="tag">
                        Fair Price
                    </div>
                )
                break;
            case 3:
                return (
                    <div className="tag">
                        Expensive
                    </div>
                )
                break;
        }
    }

    function getCategoriesTags(categories) {
        var filteredArray = fetchedCategories?.filter((categoryObj) => categories?.includes(categoryObj._id))

        return filteredArray.map((item) => {
            return (
                <div className="tag">
                    {item.name}
                </div>
            )
        })
    }


    function getRestaurantHeader() {
        return (
            <div className="headerContainer">
                <div className="headerInfo">
                    <p>
                        {fetchedRestaurantDetails.name}
                    </p>
                    {getCategoriesTags(fetchedRestaurantDetails.categories)}

                    {getPriceRatingTag(fetchedRestaurantDetails.priceRating)}
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
                            {fetchedRestaurantDetails?.menu?.length}
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


    function getMenuImageComponent(image) {
        if (image != null) {
            return (
                <img src={image} className="menuImage" />
            )
        }
        else {
            return (
                <div className="menuImage">
                    Add Image
                </div>
            )
        }

    }

    const onSaveBtnClicked = () => {
        if (selectedMenuItemImage == null || itemName == "" || calories == "" || price == "" || description == "") {
            alert("All fields are required");
            return
        }

        var bodyFormData = new FormData();
        bodyFormData.append('name', itemName)
        bodyFormData.append('image', selectedMenuItemImage)
        bodyFormData.append('description', description)
        bodyFormData.append('calories', calories)
        bodyFormData.append('price', price)
        bodyFormData.append('restaurantId', restaurantId)
        axios({
            method: "post",
            url: "http://localhost:5000/api/restaurants/add/menuIitem",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                setFetchedRestaurantDetails(response.data)
                setSelectedMenuItemImage(null)
                setSelectedMenuItemImageAsURL(null)
                setPrice("")
                setCalories("")
                setDescription("")
                setItemName("")
                console.log(response)
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }


    function getMenuList() {
        return (
            <div className="menuContainer">
                <p>
                    Menu
                </p>
                <div className="menuListContainer">


                    <div className="menuCard">
                        <div className="menuImage">
                            <input
                                accept="image/*"
                                id="contained-button-file"
                                className="input"
                                multiple
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="contained-button-file">
                                <IconButton component="span">
                                    {getMenuImageComponent(selectedMenuItemImageAsURL)}
                                </IconButton>
                            </label>
                        </div>

                        <div className="menuItemDetailContainer">
                            <div className="row">
                                <div className="itemTitle">
                                    <TextField value={itemName} onChange={(e) => setItemName(e.target.value)} style={{ width: "100%" }} label="Item Name" />
                                </div>
                            </div>
                            <div className="caloriesAndPriceText">
                                <div className="itemPrice">
                                    <span>$</span>
                                    <TextField value={price} onChange={(e) => setPrice(e.target.value)} id="standard-basic" label="Price" />
                                </div>
                                <div className="caloriesText">
                                    <span>🔥</span>
                                    <TextField value={calories} onChange={(e) => setCalories(e.target.value)} id="standard-basic" label="Calories" />
                                </div>
                            </div>

                            <div className="itemDescription">
                                <TextField value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", marginBottom: '10px' }} label="Description" />
                            </div>

                            <div className="">
                                <Button variant="contained" className="button" onClick={() => onSaveBtnClicked()}>
                                    Save
                                </Button>
                            </div>
                        </div>

                    </div>





                    {fetchedRestaurantDetails?.menu?.map((item) => (
                        <div className="menuCard">
                            <img src={item.photo} className="menuImage" />

                            <div className="menuItemDetailContainer">
                                <div className="row">
                                    <div className="itemTitle">
                                        {item.name}
                                    </div>


                                    <div className="itemPrice">
                                        ${item.price}
                                    </div>
                                </div>
                                <div className="caloriesText">
                                    🔥 {item.calories} cal
                                </div>

                                <p className="itemDescription">
                                    {item.description}
                                </p>

                                <div className="menuCardActions">
                                    <Button variant="contained" color='secondary' onClick={() => removeBtnClicked(item._id)}>
                                        Remove
                                </Button>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div >
        )
    }

    const removeBtnClicked = (menuItemId) => {

        axios({
            method: "delete",
            url: 'http://localhost:5000/api/restaurants/deleteMenuItem/' + restaurantId + '/' + menuItemId,
            // data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                console.log(response)
                setFetchedRestaurantDetails(response.data)
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }



    return (
        <div className="container">
            {getRestaurantHeader()}
            {getMenuList()}
        </div>
    )
}

export default ViewRestaurant
