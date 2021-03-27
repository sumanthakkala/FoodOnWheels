import React from 'react'
import './sidebar.css';
import { SidebarData } from './SidebarData'
import { NavLink } from 'react-router-dom'

function getSidebarRows() {
    var result = SidebarData.map((val, key) => {
        return (<li key={key} className="sidebarRow">
            <NavLink exact to={val.link} className="sideBarLink" activeClassName="active">
                <div id="icon">
                    {val.icon}
                </div>
                <div id="title">
                    {val.title}
                </div>
            </NavLink>

        </li>)
    })
    return result;
}


function Sidebar() {
    return (
        <div className=" sidebar">
            <ul className="sidebarList">
                {getSidebarRows()}
            </ul>

        </div>
    )
}

export default Sidebar
