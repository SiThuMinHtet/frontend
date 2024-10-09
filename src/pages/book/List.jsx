import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import '../../styles/UserList.css';
import '../../styles/card.css';
export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        axios
            .get("http://localhost:8080/products/list")
            .then(response => {
                setProducts(response.data);
                // setLoading(true);
            }).catch(err => {
                console.log(err);
            })
    }, [loading])

    const editHandler = (id) => {
        navigate(`/products/edit/${id}`);
    }

    const deleteHandler = useCallback(async (id) => {
        console.log("deleteHandler called for ID:", id);
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/products/delete/${id}`)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [])

    const ProductRow = React.memo(({ product, index }) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td><img src={product.image} alt="Uploaded preview" width="40" /></td>
            <td>{product.qty}</td>
            <td>{product.brand}</td>
            <td>
                <button className="editbtn" onClick={() => editHandler(product.id)}>
                    Edit
                </button>

                <button className="delbtn" onClick={() => deleteHandler(product.id)}>
                    Delete
                </button>
            </td>
        </tr>
    ));

    const ProductCard = React.memo(({ product, index }) => (
        <div className="product-card" key={index}>
            <div className="product-card-header">
                <h3>{product.name}</h3>
            </div>
            <div className="product-card-body">
                <img src={product.image} alt="Uploaded preview" width="100" />
                <div className="product-details">
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Quantity:</strong> {product.qty}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                </div>
            </div>
            <div className="product-card-footer">
                <button style={{width:100,margin:"0 auto"}} className="editbtn" onClick={() => editHandler(product.id)}>
                    AddCart
                </button>
            </div>
        </div>
    ));

    const ProductListTable = React.memo(({ products }) => (
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Brand</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map((product, index) => (
                        <ProductRow key={product.id} product={product} index={index} />
                    ))
                }
            </tbody>
        </table>
    ))

    return (
        <div className="listcontainer">
            <h1>Product List</h1>
            <Link to={`/products/entry`}>
                <button className="addbtn">Add Product</button>
            </Link>
            <ProductListTable products={products} />
            <br/><br/>
            <h1>Point: </h1>
            {
                products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))
            }
        </div>
    );
}