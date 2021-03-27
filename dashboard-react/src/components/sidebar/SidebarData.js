import React from 'react'
import { MdDashboard, MdStore, MdViewList } from 'react-icons/md'

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <MdDashboard />,
        link: "/"
    },
    {
        title: "Restaurants",
        icon: <MdStore />,
        link: "/restaurants"
    },
    {
        title: "Orders",
        icon: <MdViewList />,
        link: "/orders"
    }
]