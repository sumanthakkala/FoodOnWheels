import React from 'react'
import './coupons.css'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { IconButton } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Add from '@material-ui/icons/Add';
import axios from 'axios';
import { RiCoupon5Fill } from "react-icons/ri";

function Coupons() {




    const [couponCode, setCouponCode] = React.useState("");
    const [couponPercentage, setCouponPercentage] = React.useState("");

    const [fetchedCouponsData, setFetchedCouponsData] = React.useState([])

    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/coupons`)
            .then(res => {
                setFetchedCouponsData(res.data ? res.data : [])
            })
    }, [])

    const addCouponClicked = () => {
        if (couponCode == "" || couponPercentage == "") {
            alert("Enter coupon details")
            return
        }

        var bodyFormData = new FormData();
        // bodyFormData.append('name', categoryName)
        // bodyFormData.append('image', selectedCategoryIcon)

        var body = {
            couponCode: couponCode,
            couponPercentage: couponPercentage
        }
        axios({
            method: "post",
            url: process.env.REACT_APP_API_BASE_URL + "/api/coupons",
            data: body,
        })
            .then(function (response) {
                //handle success
                fetchedCouponsData.push(response.data ? response.data : [])
                setFetchedCouponsData([...fetchedCouponsData])

                setCouponCode("")
                setCouponPercentage("")

                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }

    const deleteCouponClicked = (_id) => {
        axios({
            method: "delete",
            url: process.env.REACT_APP_API_BASE_URL + '/api/coupons/' + _id,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                fetchedCouponsData.splice(fetchedCouponsData.findIndex((item) => {
                    return item._id === _id
                }));
                setFetchedCouponsData([...fetchedCouponsData])
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }

    function getCategoriesComponent() {
        return (
            <div className="categoriesContainer">
                <div className="addCategoryCard">

                    <RiCoupon5Fill className="couponIcon" />
                    <div className="couponInputContainer">
                        <TextField className="couponCodeInput" label="Coupon Code*" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                        <TextField className="couponPercentageInput" label="%*" value={couponPercentage} onChange={(e) => setCouponPercentage(e.target.value)} />
                    </div>

                    <div className="addCategory">
                        <IconButton onClick={addCouponClicked} style={{ color: 'black' }}>
                            <Add />
                        </IconButton>

                    </div>
                </div>

                {fetchedCouponsData?.map((item) => (
                    <div className="categoryCard">
                        {/* <Avatar className="categoryAvatar" src={item.icon}></Avatar> */}
                        <RiCoupon5Fill className="couponIcon" />
                        <div className="categoryNameText">{item.couponCode}</div>
                        <div className="categoryNameText">{item.couponPercentage + "%"}</div>
                        <div className="deleteCategory">
                            <IconButton onClick={() => deleteCouponClicked(item._id)} style={{ color: 'black', padding: '0px' }}>
                                <Clear />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        )
    }






    return (
        <div className="container">
            {getCategoriesComponent()}
        </div>
    )
}

export default Coupons
