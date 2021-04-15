import React from 'react'
import { MdDashboard, MdStore } from 'react-icons/md'
import { FaClipboardList, FaBraille } from "react-icons/fa";
import { RiCoupon5Fill } from "react-icons/ri";



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
        icon: <FaClipboardList />,
        link: "/orders"
    },
    {
        title: "Categories",
        icon: <FaBraille />,
        link: "/categories"
    },
    {
        title: "Coupons",
        icon: <RiCoupon5Fill />,
        link: "/coupons"
    }
]