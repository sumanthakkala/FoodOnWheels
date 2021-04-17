import React from 'react'
import './dashboard.css'
import { FaChartPie, FaUserFriends, FaChartLine } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { NavLink } from 'react-router-dom'
import { Bar, Line, Doughnut } from "react-chartjs-2";
import * as Zoom from 'chartjs-plugin-zoom'

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
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/orders`)
            .then(res => {
                console.log(res.data)
                // setOrders(res.data)
                setFetchedOrders(res.data)
                var total = res.data?.reduce((a, b) => a + (b.orderTotal || 0), 0)
                var delivaryFee = res.data?.reduce((a, b) => a + (b.delivaryFee || 0), 0)
                var serviceFee = res.data?.reduce((a, b) => a + (b.serviceFee || 0), 0)
                var hst = res.data?.reduce((a, b) => a + (b.hst || 0), 0)
                setTotlaRevenue(total)
                setDelivaryFeeRevenue(delivaryFee)
                setServiceFeeRevenue(serviceFee)
                setTotalHst(hst)
                if (res.data.length > 10) {
                    setRecentOrders(res.data.slice(Math.max(res.data.length - 10, 1)).reverse())
                }
                else {
                    setRecentOrders(res.data.reverse())
                }
            })
    }, [])

    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/restaurants`)
            .then(res => {
                setFetchedRestaurants(res.data)
            })
    }, [])
    React.useEffect(() => {

        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/coupons`)
            .then(res => {
                console.log(res.data)
                setCoupons(res.data)
            })
    }, [])

    const [fetchedOrders, setFetchedOrders] = React.useState([])
    const [fetchedRestaurants, setFetchedRestaurants] = React.useState([])
    const [totalRevenue, setTotlaRevenue] = React.useState(0)
    const [delivaryFeeRevenue, setDelivaryFeeRevenue] = React.useState(0)
    const [serviceFeeRevenue, setServiceFeeRevenue] = React.useState(0)
    const [totalHst, setTotalHst] = React.useState(0)
    const [recentOrders, setRecentOrders] = React.useState([])
    const [coupons, setCoupons] = React.useState([])


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
                        ${totalRevenue.toFixed(2)}
                    </div>
                </div>

                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Delivary Fee Revenue
                    </div>
                        <GiReceiveMoney />
                    </div>

                    <div>
                        ${delivaryFeeRevenue.toFixed(2)}
                    </div>
                </div>

                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Service Fee Revenue
                    </div>
                        <GiReceiveMoney />
                    </div>

                    <div>
                        ${serviceFeeRevenue.toFixed(2)}
                    </div>
                </div>

                <div className="overviewTile">
                    <div className="row">
                        <div>
                            Total HST @13%/Order
                    </div>
                        <GiReceiveMoney />
                    </div>

                    <div>
                        ${totalHst.toFixed(2)}
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









    function getDataForVisitsVsSales() {

        var restaurants = [...fetchedRestaurants]

        var labels = []
        var visits = []
        var sales = []
        var orderCount = []

        restaurants.map((item) => {
            var orders = fetchedOrders?.filter((order) => {
                return order.restaurantId === item._id
            })
            labels.push(item.name)
            visits.push(item.visitCount)
            orderCount.push(orders?.length)
            sales.push(parseFloat(orders?.reduce((a, b) => a + (b.orderTotal || 0), 0)).toFixed(2))

        })

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Visits',
                    data: visits,
                    backgroundColor: '#fc6d3f', //fc6d3f
                },
                // {
                //     label: 'Sales',
                //     data: sales,
                //     backgroundColor: '#00bf72', //00bf72
                // },
                {
                    label: 'Orders Count',
                    data: orderCount,
                    backgroundColor: '#004d7a', //004d7a
                }
            ]
        };
        return data
    }

    const visitVsSalesConfig = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        zoom: {
            enabled: true,
            drag: false,
            sensitivity: 0.5,
            mode: "xy",
            threshold: 0
        },
        pan: {
            enabled: true,
            mode: "xy",
            speed: 1,
            threshold: 1,
        },
    }

    function getLineChartData() {

        var labels = []
        var revenueDataset = []
        var orderCountDataset = []
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
                },
                {
                    label: 'Orders Count',
                    data: orderCountDataset,
                    borderColor: 'blue'
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
                    },
                },
            ],

            xAxes: [
                {
                    id: 'xAxis',
                    ticks: {
                        align: 'end',
                        autoSkip: true,
                    }
                },
            ],
        }
    };

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    function getRestaurantVsSalesData() {
        var sales = []
        var labels = []
        var colours = []
        fetchedRestaurants?.map((item) => {
            var orders = fetchedOrders?.filter((order) => {
                return order.restaurantId === item._id
            })
            sales.push(parseFloat(orders?.reduce((a, b) => a + (b.orderTotal || 0), 0)).toFixed(2))
            labels.push(item.name)
            colours.push("#" + genRanHex(6))
        })
        var data = {
            datasets: [{
                data: sales,
                backgroundColor: colours
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labels
        };
        return data
    }

    const resvsSalesConfig = {
        responsive: true,
        maintainAspectRatio: false,
        stacked: false,
    };

    function getCouponsStats() {
        var labels = []
        var count = []
        coupons?.map((item) => {
            labels.push(item.couponCode)

            var orders = fetchedOrders?.filter((order) => {
                return order.couponCode === item.couponCode
            })
            count.push(orders.length)
        })

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Coupons',
                    data: count,
                    backgroundColor: '#ggg', //fc6d3f
                },
            ]
        };

        return data
    }

    const couponsConfig = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false
            }],
            yAxes: [{
                stacked: false,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true,
                    stepSize: 1
                },
            }]
        },
    }

    function getStats() {
        return (
            <div className="statsContainer">
                <p>
                    Statistics
                </p>

                <div className="chartsContainer">
                    <div className="chartsRow" style={{ marginBottom: '100px' }}>
                        <div className="chartContainer">

                            <Bar data={getDataForVisitsVsSales()} width={50} height={50} options={visitVsSalesConfig} />
                        </div>

                        <div className="chartContainer">

                            <Line data={getLineChartData()} width={50} height={50} options={lineOptions} />
                        </div>
                    </div>

                    <div className="chartsRow">
                        <div className="chartContainer">

                            <Doughnut data={getRestaurantVsSalesData()} width={50} height={50} options={resvsSalesConfig} />
                        </div>

                        <div className="chartContainer">

                            <Bar data={getCouponsStats()} width={50} height={50} options={couponsConfig} />
                        </div>
                    </div>



                </div>

            </div>
        )
    }





    return (
        <div className="container">
            {getOverviewData()}
            {getStats()}
            {getRecentOrdersComponent()}
        </div>
    )
}

export default Dashboard
