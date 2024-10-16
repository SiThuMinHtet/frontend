import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

import BookEntry from './pages/book/Entry';
import BookList from './pages/book/List';

import LibrarianList from './pages/user/List';

import Login from './pages/auth/Login';
import Entry from './pages/auth/Entry';


// import useAxiosInterceptor from "./helper/axiosInterceptor";

import RouteGuard from "./pages/auth/RouteGuard";

function App() {
    // useAxiosInterceptor()
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RedirectToMainPage />} />
                <Route path="*" element={<RedirectToMainPage />} />
                <Route path="/auth/login" element={<Login/>}/>
                <Route path="/auth/register" element={<Entry/>}/>

                {/* Route Guard */}
                <Route element={<RouteGuard allowedRoles={["Admin","Staff"]}/>}>
                    <Route path="/users/list" element={<LibrarianList/>}/>
                </Route>

                <Route path="/books/list" element={<BookList/>}/>
                <Route path="/books/entry" element={<BookEntry/>}/>
                <Route path="/books/edit/:id" element={<BookEntry/>}/>

            </Routes>
        </Router>
    );
}

function RedirectToMainPage() {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/auth/login");
    },[navigate])

    return null;
}

export default App;