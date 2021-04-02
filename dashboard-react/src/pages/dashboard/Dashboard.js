import React from 'react'
import './dashboard.css'
import { FaChartPie, FaUserFriends, FaChartLine } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { NavLink } from 'react-router-dom'



import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import { green } from '@material-ui/core/colors';


function Dashboard() {

    React.useEffect(() => {
        axios.get(`http://192.168.2.19:5000/api/orders`)
            .then(res => {
                console.log(res.data)
                // setOrders(res.data)
                setFetchedOrders(res.data)
                var total = res.data?.reduce((a, b) => a + (b.orderTotal || 0), 0)
                setTotlaRevenue(total)
                if (res.data.length > 10) {
                    setRecentOrders(res.data.slice(Math.max(res.data.length - 10, 1)).reverse())
                }
                else {
                    setRecentOrders(res.data.reverse())
                }
            })
    }, [])

    React.useEffect(() => {
        axios.get(`http://localhost:5000/api/restaurants`)
            .then(res => {
                setFetchedRestaurants(res.data)
            })
    }, [])


    const [fetchedOrders, setFetchedOrders] = React.useState([])
    const [fetchedRestaurants, setFetchedRestaurants] = React.useState([])
    const [totalRevenue, setTotlaRevenue] = React.useState(0)
    const [recentOrders, setRecentOrders] = React.useState([])


    function getOverviewData() {
        return (
            <div className="overviewContainer">
                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Restaurants
                    </div>
                        <FaChartPie />
                    </div>

                    <div>
                        {fetchedRestaurants.length}
                    </div>
                </div>


                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Revenue
                    </div>
                        <GiReceiveMoney />
                    </div>

                    <div>
                        ${totalRevenue}
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


                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Users
                    </div>
                        <FaUserFriends />
                    </div>

                    <div>
                        120
                </div>
                </div>
            </div>
        )
    }


    function getRestaurantNameById(id) {
        return fetchedRestaurants?.find(item => item._id === id)?.name
    }

    function getRecentOrdersComponent() {
        return (

            <div className="recentOrdersContainer">
                <div className="row">
                    <p>
                        Recent Orders
            </p>
                    <NavLink to="/orders" className="button">View All</NavLink>
                </div>

                <div>
                    <TableContainer>
                        <Table className="table" size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="tableheaderCell">Order Id</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Restaurant</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Delivary Address</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Order Price ($)</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentOrders?.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="tableCell" component="th" scope="row">
                                            {order._id}
                                        </TableCell>
                                        <TableCell className="tableCell" align="right">{fetchedRestaurants ? getRestaurantNameById(order?.restaurantId) : ""}</TableCell>
                                        <TableCell className="tableCell" align="right">{order.address}</TableCell>
                                        <TableCell className="tableCell" align="right" style={{ color: 'darkGreen', fontWeight: 'bold' }}>${order.orderTotal}</TableCell>
                                        <TableCell className="tableCell" align="right">{order.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

        )
    }


    return (
        <div className="container">
            {getOverviewData()}

            {getRecentOrdersComponent()}
        </div>
    )
}

export default Dashboard
