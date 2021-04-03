import React from 'react'
import './orders.css'
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import { makeStyles } from '@material-ui/core/styles';






import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios';



// const useStyle = makeStyles((theme) => ({
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     },
//     selectEmpty: {
//         marginTop: theme.spacing(2),
//     },
// }));



function Orders() {
    // const classes = useStyle();
    const [orderStatusFilter, setOrderStatusFilter] = React.useState(10);
    const [orderTimelineFilter, setOrderTimelineFilter] = React.useState(10);
    const [fetchedOrders, setFetchedOrders] = React.useState([])
    const [fetchedRestaurants, setFetchedRestaurants] = React.useState([])
    const [filteredOrders, setFilteredOrders] = React.useState([])


    React.useEffect(() => {
        axios.get(`http://192.168.2.19:5000/api/orders`)
            .then(res => {
                console.log(res.data)
                // setOrders(res.data)
                setFetchedOrders(res.data.reverse())
                setFilteredOrders(res.data)
            })
    }, [])

    React.useEffect(() => {
        axios.get(`http://localhost:5000/api/restaurants`)
            .then(res => {
                setFetchedRestaurants(res.data)
            })
    }, [])




    const handleStatusChange = (event) => {
        setOrderStatusFilter(event.target.value);
        refreshListByFilter(event.target.value, orderTimelineFilter)
    };

    const handleTimelineChange = (event) => {
        setOrderTimelineFilter(event.target.value);
        refreshListByFilter(orderStatusFilter, event.target.value)
    };

    function refreshListByFilter(statusFilter, timelineFilter) {
        var fromDate = new Date()
        var toDate = new Date()
        var isAllTime = false
        var isAllOrders = false
        var statusFiterQuery = ""
        switch (timelineFilter) {
            case 10:
                isAllTime = true;
                break;
            case 20:
                fromDate.setHours(0, 0, 0, 0);
                break;
            case 30:
                fromDate.setDate(new Date().getDate() - 7)
                break;
            case 40:
                fromDate.setDate(new Date().getDate() - 30)
                break;
        }
        var filteredOrdersByTimeline = []
        if (isAllTime) {
            filteredOrdersByTimeline = [...fetchedOrders];
        }
        else {
            filteredOrdersByTimeline = fetchedOrders.filter((order) => {
                return new Date(order.dateCreated).getTime() >= fromDate.getTime() &&
                    new Date(order.dateCreated).getTime() <= toDate.getTime();
            });
        }

        switch (statusFilter) {
            case 10:
                isAllOrders = true;
                statusFiterQuery = ""
                break;
            case 20:
                statusFiterQuery = "placed"

                break;
            case 30:
                statusFiterQuery = "preparing"

                break;
            case 40:
                statusFiterQuery = "onTheWay"

                break;
            case 50:
                statusFiterQuery = "delivered"

                break;
        }

        if (isAllTime && isAllOrders) {
            setFilteredOrders([...fetchedOrders])
            console.log(filteredOrders)
        }
        else if (statusFiterQuery === "") {
            setFilteredOrders([...filteredOrdersByTimeline])
        }
        else {
            setFilteredOrders([...(filteredOrdersByTimeline.filter((order) => {
                return order.status === statusFiterQuery
            }))])

            console.log(filteredOrders)
        }

    }



    function getFiltersComponent() {

        return (
            <div className="filtersContainer">
                <p>
                    Filter By
                </p>
                <div>
                    <FormControl className="formControl">
                        <Select
                            value={orderStatusFilter}
                            onChange={handleStatusChange}
                            displayEmpty
                            className=""
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Status
                        </MenuItem>
                            <MenuItem value={10}>All Orders</MenuItem>
                            <MenuItem value={20}>Placed/Pending</MenuItem>
                            <MenuItem value={30}>Preparing</MenuItem>
                            <MenuItem value={40}>On The Way</MenuItem>
                            <MenuItem value={50}>Delivered</MenuItem>
                        </Select>
                        <FormHelperText>Status</FormHelperText>
                    </FormControl>


                    <FormControl className="formControl">
                        <Select
                            value={orderTimelineFilter}
                            onChange={handleTimelineChange}
                            displayEmpty
                            className=""
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Timeline
                        </MenuItem>
                            <MenuItem value={10}>All Time</MenuItem>
                            <MenuItem value={20}>Today</MenuItem>
                            <MenuItem value={30}>Last Week</MenuItem>
                            <MenuItem value={40}>Last Month</MenuItem>
                        </Select>
                        <FormHelperText>Timeline</FormHelperText>
                    </FormControl>
                </div>
            </div>



        )
    }




    function getRestaurantNameById(id) {
        return fetchedRestaurants?.find(item => item._id === id)?.name
    }

    function getMenuItemNameById(restaurantId, menuItemId) {
        return fetchedRestaurants?.find(restaurant => restaurant._id === restaurantId)?.menu.find(item => item._id === menuItemId).name
    }

    function Row(props) {
        const { order } = props;
        const [open, setOpen] = React.useState(false);
        // const classes = useRowStyles();

        return (
            <React.Fragment>
                <TableRow className="">
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {order._id}
                    </TableCell>
                    <TableCell align="right">{getRestaurantNameById(order.restaurantId)}</TableCell>
                    <TableCell align="right">{order.address}</TableCell>
                    <TableCell align="right" style={{ color: 'green', fontWeight: 'bold' }}>${order.orderTotal}</TableCell>
                    <TableCell align="right">{order.status}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Details
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'bisque', fontWeight: 'bold' }}>
                                            <TableCell style={{ fontWeight: 'bold' }}>Item</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Qty</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }} align="right">Price</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }} align="right">Total ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.orderedMenu.map((detailsRow) => (
                                            <TableRow key={detailsRow.menuItemId}>
                                                <TableCell component="th" scope="row">
                                                    {getMenuItemNameById(order.restaurantId, detailsRow.menuItemId)}
                                                </TableCell>
                                                <TableCell>{detailsRow.qty}</TableCell>
                                                <TableCell align="right" style={{ color: 'orange', fontWeight: 'bold' }}>${detailsRow.price}</TableCell>
                                                <TableCell align="right" style={{ color: 'brown', fontWeight: 'bold' }}>
                                                    ${Math.round(detailsRow.price * detailsRow.qty)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    Row.propTypes = {
        row: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            restaurantId: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            orderedMenu: PropTypes.arrayOf(
                PropTypes.shape({
                    menuItemId: PropTypes.string.isRequired,
                    qty: PropTypes.number.isRequired,
                    price: PropTypes.number.isRequired,
                    total: PropTypes.number.isRequired
                }),
            ).isRequired,
            orderTotal: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
        }).isRequired,
    };


    function getOrdersComponent() {
        return (
            <div className="ordersContainer">
                <p>
                    Order Details
                </p>
                <div>
                    <TableContainer >
                        <Table aria-label="collapsible table">
                            <TableHead className="tableHead">
                                <TableRow>
                                    <TableCell className="tableheaderCell" />
                                    <TableCell className="tableheaderCell">Order Id</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Restaurnt</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Delivary Address</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Order Price</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders?.map((order) => (
                                    <Row key={order._id} order={order} />
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
            {getFiltersComponent()}
            {getOrdersComponent()}
        </div>
    )
}

export default Orders
