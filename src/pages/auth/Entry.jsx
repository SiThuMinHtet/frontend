import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import InputField from "../../components/input/inputField";
import '../../styles/global.css';
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:8080/users/getbyId/${id  }`, {
                    headers: {
                        "otmm-api-key": "KoaderMasters",
                    },
                }).then((res) => {
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

    const validateForm = () => {
        const newErrors = {};
        for (const field in formData) {
            if (formData[field] === "" || formData[field] == null) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty!`
            }
        }
        return newErrors;
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();

        // const validateErrors = validateForm();
        // if (Object.keys(validateErrors).length > 0) {
        //     setErrors(validateErrors);
        //     return;
        // }

        try {
            if (id) {
                await axios.put(`http://localhost:8080/users/edit/${id}`, formData, {
                    headers: {
                        "otmm-api-key": "KoaderMasters",
                    },
                })
                .then( _ => {
                    navigate('/users/list')
                })
            } else {
                await axios.post(`http://localhost:8080/auth/register`, formData, {
                    headers: {
                        "otmm-api-key": "KoaderMasters",
                    },
                })
                .then( _ => {
                    navigate('/login')
                })
            }
            
        } catch (err) {
            if (err.response) {
                console.log(err.response);
                // Assuming the errors are returned as an array of strings
                const validationErrors = {};
                err.response.data.errors.forEach((err) => {
                    if (err === "Change to Upper Case Product Name") {
                        validationErrors.name = err;
                    } else if (err === "Change to Upper Case Product Status") {
                        validationErrors.status = err;
                    }
                });
                setErrors(validationErrors);
            }
        }

    }
    return (
        <div className="container">
            <form className="formLogin" onSubmit={submitHandler}>
                <h2>{id ? "Update User Form" : "Sign Up"}</h2>
                <InputField
                    label="name"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    name="username"
                    placeholder="name"

                />
                <InputField
                    label="email"
                    type="text"
                    value={formData.email}
                    onChange={handleInputChange}
                    name="email"
                    placeholder="email"

                />
                <InputField
                    label="role"
                    type="text"
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    placeholder="role"

                />
                <InputField
                    label="password"
                    type="text"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    placeholder="password"
                    style={{ display: id ? "none" : "block" }}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    placeholder="User Image"
                />
                <button className="signbtn">{id ? "Update" : "Register"}</button>
                <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
                    Already have a account? <Link to="/login">Sign In</Link>
                </span>
            </form>
        </div>
    )
}