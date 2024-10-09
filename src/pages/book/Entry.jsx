import React, { useEffect, useState } from "react";
import "../../styles/global.css"
import { useParams, Link, useNavigate } from "react-router-dom";
import InputField from "../../components/input/inputField";
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image: "",
        qty: "",
        brand: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:8080/products/getbyId/${id }`)
                .then((res) => {
                    console.log(res.data);
                    setFormData(res.data);
                }).catch(err => {
                    console.error(err);
                })
        }
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.replace(/^\s/, '')
        }))
    }

    const handleFileChange = (e) => {
        const data = new FileReader();
        data.addEventListener("load", ()=> {
            setFormData((prevData) => ({
                ...prevData,
                image: data.result // Store Base64 string
            }));
        })
        data.readAsDataURL(e.target.files[0]);
    }

    // const validateForm = () => {
    //     const newErrors = {};
    //     for (const field in formData) {
    //         if (formData[field] === "" || formData[field] == null) {
    //             newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty!`
    //         }
    //     }
    //     return newErrors;
    // }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(formData);
        // const validateErrors = validateForm();
        // if (Object.keys(validateErrors).length > 0) {
        //     setErrors(validateErrors);
        //     return;
        // }

        try {
            if (id) {
                await axios.put(`http://localhost:8080/products/edit/${id}`, formData)
            } else {
                await axios.post(`http://localhost:8080/products/entry`,formData)
            }
        } catch (err) {
            console.log("Error : "+ err.message);
        }
        navigate('/products/list')

    }
    return (
        <div className="container">
            <form className="formLogin" onSubmit={submitHandler}>
                <h2>{id ? "Update Product Form" : "Product Register Form"}</h2>
                <InputField
                    label="Product Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    name="name"
                    placeholder="name"

                />
                <InputField
                    label="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    name="price"
                    placeholder="price"

                />
                <label htmlFor="image">Image</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    placeholder="User Image"
                    name="image"
                />
                <InputField
                    label="Quantity"
                    type="number"
                    value={formData.qty}
                    onChange={handleInputChange}
                    name="qty"
                    placeholder="Quantity"

                />
                <InputField
                    label="Brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleInputChange}
                    name="brand"
                    placeholder="brand"
                />
                <button className="signbtn">{id ? "Update" : "Register"}</button>
                <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
                    Already have a account? <Link to="/login">Sign In</Link>
                </span>
            </form>
        </div>
    )
}