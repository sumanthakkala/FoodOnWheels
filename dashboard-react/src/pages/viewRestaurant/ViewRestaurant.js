import React from 'react'
import './viewRestaurant.css'
import { FaChartPie, FaUserFriends, FaChartLine } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { IconButton } from '@material-ui/core';
import axios from 'axios';
import { useParams } from 'react-router';
import { Bar, Line } from "react-chartjs-2";


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
    const [fetchedOrders, setFetchedOrders] = React.useState([])
    const [totalRevenue, setTotlaRevenue] = React.useState(0)

    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/restaurants/` + restaurantId)
            .then(res => {
                setFetchedRestaurantDetails(res.data)

                axios.get(process.env.REACT_APP_API_BASE_URL + `/api/orders/restaurant/` + res.data._id)
                    .then(res => {
                        console.log(res.data)
                        // setOrders(res.data)
                        setFetchedOrders(res.data)
                        var total = res.data?.reduce((a, b) => a + (b.orderTotal || 0), 0)
                        setTotlaRevenue(total)
                    })
            })

        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/categories`)
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
                            ${totalRevenue.toFixed(2)}
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
                            {fetchedOrders.length}
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
            url: process.env.REACT_APP_API_BASE_URL + "/api/restaurants/add/menuIitem",
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
            url: process.env.REACT_APP_API_BASE_URL + '/api/restaurants/deleteMenuItem/' + restaurantId + '/' + menuItemId,
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

    function getDataForBarChart() {
        const data = {
            labels: ["Visists", "Sales"],
            datasets: [{
                label: "Visits vs Sales",
                borderWidth: 1,
                backgroundColor: '#fc6d3f',
                data: [fetchedRestaurantDetails?.visitCount, fetchedOrders.length],
            }]
        };
        return data
    }

    const barOptions = {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        maintainAspectRatio: false
    };

    function getLineChartData() {

        var labels = []
        var revenueDataset = []
        var orderCountDataset = []
        debugger
        var ordersCopy = [...fetchedOrders]
        const sortedOrders = ordersCopy.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))

        sortedOrders?.map((item) => {
            var date = new Date(item.dateCreated)

            var labelDateStr = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
            var labelDate = new Date(labelDateStr)
            var labelsIndex = labels.indexOf(labelDateStr)
            if (labelsIndex >= 0) {
                revenueDataset[labelsIndex] = parseFloat(revenueDataset[labelsIndex]) + item.orderTotal
                orderCountDataset[labelsIndex] = orderCountDataset[labelsIndex] + 1
                revenueDataset[labelsIndex] = parseFloat(revenueDataset[labelsIndex]).toFixed(2)
            }
            else {
                labels.push(labelDateStr)
                revenueDataset.push(parseFloat(item.orderTotal).toFixed(2))
                orderCountDataset.push(1)
            }
        })

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueDataset,
                    borderColor: 'red'
                    // yAxisID: 'yAxis',
                },
                {
                    label: 'Orders Count',
                    data: orderCountDataset,
                    borderColor: 'blue'
                    // yAxisID: 'yAxis',
                }
            ]
        };
        return data
    }

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        scales: {
            yAxes: [
                {
                    id: 'yAxis',
                    ticks: {
                        autoSkip: true,
                        // maxTicksLimit: 10,
                        // beginAtZero: true,
                    },
                },
            ],

            xAxes: [
                {
                    // distribution: 'linear',
                    // type: "time",
                    // time: {
                    //     min: range_min.getTime(),
                    //     max: range_max.getTime(),
                    //     unit: "day",
                    //     unitStepSize: 1,
                    //     displayFormats: {
                    //         day: '\nDD/MM/YYYY hh:mm a\n'
                    //     },
                    // },
                    id: 'xAxis',
                    ticks: {
                        align: 'end',
                        autoSkip: true,
                    }
                },
            ],
        }
    };


    function getStats() {
        return (
            <div className="statsContainer">
                <p>
                    Statistics
                </p>

                <div className="chartsContainer">
                    <div className="chartsRow">
                        <div className="chartContainer">

                            <Bar data={getDataForBarChart()} width={50} height={50} options={barOptions} />
                        </div>

                        <div className="chartContainer">

                            <Line data={getLineChartData()} width={50} height={50} options={lineOptions} />
                        </div>
                    </div>


                </div>

            </div>
        )
    }


    return (
        <div className="container">
            {getRestaurantHeader()}
            {getStats()}
            {getMenuList()}
        </div>
    )
}

export default ViewRestaurant
