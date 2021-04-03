import React from 'react'
import './addRestaurant.css'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import { IconButton } from '@material-ui/core';
import axios from 'axios';

function AddRestaurant() {

    let history = useHistory();

    const [categories, setCategories] = React.useState([])
    const [isImageChanged, setIsImageChanged] = React.useState(false)
    const [selectedRestaurantImage, setSelectedCategoryIcon] = React.useState(null);
    const [selectedRestaurantImageAsURL, setSelectedCategoryIconAsURL] = React.useState(null);
    const [restaurantName, setRestaurantName] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [selectedCategories, setSelectedCategories] = React.useState([])
    const [priceRating, setPriceRating] = React.useState(0)
    const [delivaryTime, setDelivaryTime] = React.useState("")


    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/categories`)
            .then(res => {
                setCategories(res.data)
            })
    }, [])

    const handleImageChange = (e) => {
        setSelectedCategoryIcon(e.target.files[0])
        setIsImageChanged(true)
        setSelectedCategoryIconAsURL(URL.createObjectURL(e.target.files[0]))
    }

    const onCategoriesChange = (event, values) => {
        console.log(values)
        setSelectedCategories(values)
    }

    const onDelivaryTimeChange = (event) => {
        setDelivaryTime(event.target.value)
    }

    const onPriceRatingChange = (event) => {
        setPriceRating(event.target.value)
    }



    function getAddRestaurantForm() {
        return (
            <div className="addRestaurantForm">
                <div>
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
                            {isImageChanged ? <Avatar className="categoryAvatar" src={selectedRestaurantImageAsURL}></Avatar> : <Avatar className="categoryAvatar" >Image*</Avatar>}
                        </IconButton>
                    </label>
                </div>
                <TextField className="formItem" label="Restaurant Name*" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />

                <TextField className="formItem" label="Address*" value={address} onChange={(e) => setAddress(e.target.value)} />

                <Autocomplete
                    multiple
                    id="tags-standard"
                    className="formItem"
                    options={categories}
                    getOptionLabel={(option) => option ? option.name : ""}
                    // defaultValue={[categories ? categories[0] : {}}
                    onChange={onCategoriesChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Categories*"
                            placeholder="Select"
                        />
                    )}
                />


                <FormControl className="">
                    <InputLabel id="priceRatingLabel">Price Rating*</InputLabel>
                    <Select
                        labelId="priceRatingLabel"
                        id="priceRating"
                        className="formItem"
                        // value={age}
                        defaultValue=""
                        onChange={onPriceRatingChange}
                    >
                        <MenuItem value={1}>Affordable</MenuItem>
                        <MenuItem value={2}>Fair Price</MenuItem>
                        <MenuItem value={3}>Expensive</MenuItem>
                    </Select>
                </FormControl>



                <FormControl className="">
                    <InputLabel id="delivaryTimeLabel">Delivary Time*</InputLabel>
                    <Select
                        labelId="delivaryTimeLabel"
                        id="delivaryTime"
                        className="formItem"
                        // value={age}
                        defaultValue=""
                        onChange={onDelivaryTimeChange}
                    >
                        <MenuItem value={"15 - 30 mins"}>15 - 30 mins</MenuItem>
                        <MenuItem value={"30 - 45 mins"}>30 - 45 mins</MenuItem>
                        <MenuItem value={"45 - 60 mins"}>45 - 60 mins</MenuItem>
                    </Select>
                </FormControl>

                <div className="formActionsDiv formItem">
                    <Button variant="contained" className="button" onClick={() => saveBtnClicked()}>
                        Save
                    </Button>
                    <Button variant="contained" color='secondary' onClick={cancelBtnClicked}>
                        Cancel
                    </Button>
                </div>

            </div>
        )
    }
    const cancelBtnClicked = () => {
        history.goBack()
    }

    const saveBtnClicked = () => {
        // debugger
        if (selectedRestaurantImage == null || restaurantName == "" || address == "" || selectedCategories == [] || priceRating == 0 || delivaryTime == "") {
            alert("All fields are required");
            return
        }

        var bodyFormData = new FormData();
        bodyFormData.append('name', restaurantName)
        bodyFormData.append('image', selectedRestaurantImage)
        bodyFormData.append('priceRating', priceRating)
        bodyFormData.append('duration', delivaryTime)
        bodyFormData.append('address', address)
        var categoryIds = selectedCategories.map((item) => {
            return item._id
        })
        bodyFormData.append('categories', JSON.stringify(categoryIds))
        axios({
            method: "post",
            url: process.env.REACT_APP_API_BASE_URL + "/api/restaurants",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success

                history.goBack()
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }

    return (
        <div className="container">
            <div className="addRestaurantSection">
                <p>
                    Add Restaurant
              </p>
                {getAddRestaurantForm()}
            </div>

        </div>
    )
}

export default AddRestaurant
