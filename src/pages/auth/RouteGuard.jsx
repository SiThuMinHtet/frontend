import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RouteGuard = ({ allowedRoles }) => {
    let rolesArray = [];
    const userRoles = window.localStorage.getItem("role") || [];

    if(userRoles){
        rolesArray.push(userRoles);
    }

    const hasRole = allowedRoles.some((role)=> rolesArray.includes(role)); 
    console.log(allowedRoles, userRoles);
    
    if( !hasRole ) {
        localStorage.setItem("loginError", "Login Denied Your Account");
        return <Navigate to="/auth/login"/>
    }
    // return hasRole ? <Outlet /> : <Navigate to="/login" replace={true} />;
    return <Outlet/>;
}
// const RouteGuard = ({ allowedRoles }) => {

//     const userRoles = window.localStorage.getItem("role") || [];
//     const hasRole = allowedRoles.includes(userRoles); 

//     console.log(allowedRoles);
//     if( !hasRole ) {
//         localStorage.setItem("loginError", "Login Denied Your Account");
//         return <Navigate to="/auth/login"/>
//     }
//     // return hasRole ? <Outlet /> : <Navigate to="/login" replace={true} />;
//     return <Outlet/>;
// }

export default RouteGuard;