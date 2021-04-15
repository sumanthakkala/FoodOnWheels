import React from 'react'
import './categories.css'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { IconButton } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Add from '@material-ui/icons/Add';
import axios from 'axios';




function Categories() {


    const [categoryName, setCategoryName] = React.useState("");
    const [selectedCategoryIcon, setSelectedCategoryIcon] = React.useState(null);
    const [selectedCategoryIconAsURL, setSelectedCategoryIconAsURL] = React.useState(null);
    const [isImageChanged, setIsImageChanged] = React.useState(false)

    const [fetchedCategoriesData, setFetchedCategoriesData] = React.useState([])

    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/api/categories`)
            .then(res => {
                setFetchedCategoriesData(res.data ? res.data : [])
            })
    }, [])

    const addCategoryClicked = () => {
        if (selectedCategoryIcon == null) {
            alert("Select an image.");
            return
        }
        if (categoryName == "") {
            alert("Enter category name")
            return
        }
        var bodyFormData = new FormData();
        bodyFormData.append('name', categoryName)
        bodyFormData.append('image', selectedCategoryIcon)
        axios({
            method: "post",
            url: process.env.REACT_APP_API_BASE_URL + "/api/categories",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                fetchedCategoriesData.push(response.data ? response.data : [])
                setFetchedCategoriesData([...fetchedCategoriesData])
                setIsImageChanged(false)
                setSelectedCategoryIcon(null)
                setSelectedCategoryIconAsURL(null)
                setCategoryName("")

                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }

    const deleteCategoryClicked = (_id) => {
        axios({
            method: "delete",
            url: process.env.REACT_APP_API_BASE_URL + '/api/categories/' + _id,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                fetchedCategoriesData.splice(fetchedCategoriesData.findIndex((item) => {
                    return item._id === _id
                }));
                setFetchedCategoriesData([...fetchedCategoriesData])
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
    }

    const handleImageChange = (e) => {
        setSelectedCategoryIcon(e.target.files[0])
        setIsImageChanged(true)
        setSelectedCategoryIconAsURL(URL.createObjectURL(e.target.files[0]))
    }


    function getCategoriesComponent() {
        return (
            <div className="categoriesContainer">
                <div className="addCategoryCard">

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
                            {isImageChanged ? <Avatar className="categoryAvatar" src={selectedCategoryIconAsURL}></Avatar> : <Avatar className="categoryAvatar" >Add</Avatar>}

                        </IconButton>
                    </label>
                    <TextField className="categoryNameInput" label="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    <div className="addCategory">
                        <IconButton onClick={addCategoryClicked} style={{ color: 'black' }}>
                            <Add />
                        </IconButton>

                    </div>
                </div>

                {fetchedCategoriesData?.map((item) => (
                    <div className="categoryCard">
                        <Avatar className="categoryAvatar" src={item.icon}></Avatar>
                        <div className="categoryNameText">{item.name}</div>
                        <div className="deleteCategory">
                            <IconButton onClick={() => deleteCategoryClicked(item._id)} style={{ color: 'black', padding: '0px' }}>
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

export default Categories
