
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/input/inputField";
import '../../styles/global.css';
import axios from "axios";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({});
    const [loginErrorMessage, setLoginErrorMessage] = useState(""); // show login error message from localstorage
    const navigate = useNavigate();

    useEffect(() => {
        // localStorage.clear();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");

        const loginError = window.localStorage.getItem("loginError");
        if(loginError){
            setLoginErrorMessage(loginError);
            localStorage.removeItem("loginError");
        }
    }, [])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.replace(/^\s/, '')
        }))
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(formData);
        setErrors({});
        await axios
            .post("http://localhost:8080/auth/login",formData, {
                headers: {
                    "otmm-api-key": "KoaderMasters",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
            })
            .then( (res) => {
                console.log(res.data);
                
                localStorage.setItem("accessToken", res.data.accesstoken);
                navigate("/users/list");
                localStorage.setItem("role", res.data.role);
            })
            .catch( error => {
                console.log(error);
            })
    }

    return (
        <div className="container">
            {
                loginErrorMessage && 
                (
                    <h4 style={{ color: "red", textAlign: "center"}}>
                        {loginErrorMessage}
                    </h4>
                )
            }
            <form className="formLogin" onSubmit={submitHandler}>
                <h2>Sign In</h2>
                <InputField
                    label="username"
                    type="text"
                    value={formData.email}
                    onChange={handleInputChange}
                    name="email"
                    placeholder="username"

                />
                <InputField
                    label="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    placeholder="password"

                />
                <button className="signbtn">Login</button>
                <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
                    Don't have a account? <Link to="/auth/register">Create account</Link>
                </span>
            </form>
        </div>
    )
}
