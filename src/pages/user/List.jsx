import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/UserList.css';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8080/users/list",{
                headers: {
                    "otmm-api-key": "KoaderMasters",
                }
            })
            .then((response) => {
                setUsers(response.data);
            }).catch(err => {
                console.error(err);
            })
    }, [loading])
    
    const editHandler = (id) => {
        navigate(`/edit/${id}`);
    }

    const deleteHandler = useCallback(async (id) => {
        console.log("deleteHandler called for ID:", id);
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/users/delete/${id}`,{
                headers: {
                    "otmm-api-key": "KoaderMasters",
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []) 

    const UserRow = React.memo(({ user, index }) => (
        <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.password}</td>
            {localStorage.getItem("role")==="Admin" && (
            <td>
                <button className="editbtn" onClick={() => editHandler(user.id)}>
                    Edit
                </button>

                {localStorage.getItem("role")==="Admin" && (<button className="delbtn" onClick={() => deleteHandler(user.id)}>
                    Delete
                </button>)}
            </td>
            )}  
        </tr>
    ));

    const UserListTable = React.memo(({ users }) => (
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>User Role</th>
                    <th>Password</th>
                    {localStorage.getItem("role")==="Admin" && (<th>Action</th>)}
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user, index) => (
                        <UserRow key={user.id} user={user} index={index} />
                    ))
                }
            </tbody>
        </table>
    ));

    return (
        <div className="listcontainer">
            <h1>User List</h1>
            {/* <Link to={`/register`}>
                <button className="addbtn">Add Product</button>
            </Link> */}
            <UserListTable users ={users}/>
        </div>
    );
}