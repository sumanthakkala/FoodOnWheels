import React from 'react'
import './categories.css'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { IconButton } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Add from '@material-ui/icons/Add';




function Categories() {



    function getCategoriesComponent() {
        var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        return (
            <div className="categoriesContainer">
                <div className="addCategoryCard">

                    <input
                        accept="image/*"
                        id="contained-button-file"
                        className="input"
                        multiple
                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        <IconButton component="span">
                            <Avatar className="categoryAvatar">Add</Avatar>
                        </IconButton>
                    </label>
                    <TextField className="categoryNameInput" label="Category Name" />
                    <div className="addCategory">
                        <Add />
                    </div>
                </div>

                {data.map((item) => (
                    <div className="categoryCard">
                        <Avatar className="categoryAvatar">Category</Avatar>
                        <div className="categoryNameText">Category Name</div>
                        <div className="deleteCategory">
                            <Clear />
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
