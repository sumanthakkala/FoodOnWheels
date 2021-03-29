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
    const [orderStatusFilter, setOrderStatusFilter] = React.useState(0);
    const [orderTimelineFilter, setOrderTimelineFilter] = React.useState(0);
    const handleStatusChange = (event) => {
        setOrderStatusFilter(event.target.value);
    };

    const handleTimelineChange = (event) => {
        setOrderTimelineFilter(event.target.value);
    };



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
                            <MenuItem value={20}>Last Week</MenuItem>
                            <MenuItem value={30}>Last Month</MenuItem>
                        </Select>
                        <FormHelperText>Timeline</FormHelperText>
                    </FormControl>
                </div>
            </div>



        )
    }






    function createData(name, calories, fat, carbs, protein, price) {
        return {
            name,
            calories,
            fat,
            carbs,
            protein,
            price,
            history: [
                { date: '2020-01-05', customerId: '11091700', amount: 3 },
                { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
            ],
        };
    }

    function Row(props) {
        const { row } = props;
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
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    History
              </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Total price ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.history.map((historyRow) => (
                                            <TableRow key={historyRow.date}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.date}
                                                </TableCell>
                                                <TableCell>{historyRow.customerId}</TableCell>
                                                <TableCell align="right">{historyRow.amount}</TableCell>
                                                <TableCell align="right">
                                                    {Math.round(historyRow.amount * row.price * 100) / 100}
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
            calories: PropTypes.number.isRequired,
            carbs: PropTypes.number.isRequired,
            fat: PropTypes.number.isRequired,
            history: PropTypes.arrayOf(
                PropTypes.shape({
                    amount: PropTypes.number.isRequired,
                    customerId: PropTypes.string.isRequired,
                    date: PropTypes.string.isRequired,
                }),
            ).isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            protein: PropTypes.number.isRequired,
        }).isRequired,
    };

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
        createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
        createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
        createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
    ];


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
                                    <TableCell className="tableheaderCell">Dessert (100g serving)</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Calories</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell className="tableheaderCell" align="right">Protein&nbsp;(g)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <Row key={row.name} row={row} />
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
