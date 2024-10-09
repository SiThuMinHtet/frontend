import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import '../../styles/UserList.css';
import '../../styles/card.css';
export default function ProductList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        axios
            .get("http://localhost:8080/bookauthers/list/books")
            .then(response => {
                setBooks(response.data);
                // setLoading(true);
            }).catch(err => {
                console.log(err);
            })
    }, [loading])

    const editHandler = (id) => {
        navigate(`/books/edit/${id}`);
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
    console.log(books);
    const BookRow = React.memo(({ book, index }) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{book.title}</td>
            <td>{book.genre}</td>
            {/* <td><img src={books.image} alt="Uploaded preview" width="40" /></td> */}
            <td>{book.publication_date}</td>
            <td>{book.Authors.map((author) => (
                author.penname
              ))}</td>
            <td>
                <button className="editbtn" onClick={() => editHandler(book.id)}>
                    Edit
                </button>

                <button className="delbtn" onClick={() => deleteHandler(book.id)}>
                    Delete
                </button>
            </td>
        </tr>
    ));

    // const ProductCard = React.memo(({ product, index }) => (
    //     <div className="product-card" key={index}>
    //         <div className="product-card-header">
    //             <h3>{product.name}</h3>
    //         </div>
    //         <div className="product-card-body">
    //             <img src={product.image} alt="Uploaded preview" width="100" />
    //             <div className="product-details">
    //                 <p><strong>Price:</strong> ${product.price}</p>
    //                 <p><strong>Quantity:</strong> {product.qty}</p>
    //                 <p><strong>Brand:</strong> {product.brand}</p>
    //             </div>
    //         </div>
    //         <div className="product-card-footer">
    //             <button style={{width:100,margin:"0 auto"}} className="editbtn" onClick={() => editHandler(product.id)}>
    //                 AddCart
    //             </button>
    //         </div>
    //     </div>
    // ));

    const BookListTable = React.memo(({ books }) => (
        <table className="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Publication Date</th>
                    <th>Authors</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    books.map((book, index) => (
                        <BookRow key={book.id} book={book} index={index} />
                    ))
                }
            </tbody>
        </table>
    ))
    return (
        <div className="listcontainer">
            <h1>Books List</h1>
            <Link to={`/books/register`}>
                <button className="addbtn">Add Book</button>
            </Link>
            <BookListTable books={books} />
            {/* <br/><br/>
            <h1>Point: </h1>
            {
                products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))
            } */}
        </div>
    );
}