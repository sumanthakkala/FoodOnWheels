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
                    12
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
                    $1621.89
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



function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Gingerbread', 356, 16.0, 49, 3.9),

];

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
                                <TableCell className="tableheaderCell">Dessert (100g serving)</TableCell>
                                <TableCell className="tableheaderCell" align="right">Calories</TableCell>
                                <TableCell className="tableheaderCell" align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell className="tableheaderCell" align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell className="tableheaderCell" align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="tableCell" component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell className="tableCell" align="right">{row.calories}</TableCell>
                                    <TableCell className="tableCell" align="right">{row.fat}</TableCell>
                                    <TableCell className="tableCell" align="right">{row.carbs}</TableCell>
                                    <TableCell className="tableCell" align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>

    )
}

function Dashboard() {

    return (
        <div className="container">
            {getOverviewData()}

            {getRecentOrdersComponent()}
        </div>
    )
}

export default Dashboard
