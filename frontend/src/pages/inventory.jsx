import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Inventory = () => {
    const[product, setProduct] = useState([]);

    useEffect(() => {
        const listAllProduct = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/inventory");
                setProduct(res.data);
                console.log("success");
            } catch (error) {
                console.log(error)
            }
        };

        listAllProduct();
    }, []);
    
    const deleteProduct = async (id) => {
        try {
          await axios.delete(
            `http://localhost:8800/api/delete-inventory/?id=${id}`);
          window.location.reload()
        } catch (err) {
          console.log(err);
        }
    };

    return (
        <div>
      <h1>Mart A Inventory System</h1>
      <div className="inventory">
        {product.map((product) => (
          <div key={product.id} className="product">
            <h2>{product.name}</h2>
            <span>{product.quantity}</span>
            <span>${product.price}</span>
            <button className="delete" onClick={() => deleteProduct(product.id)}>Delete</button>
            <button className="update">
              <Link
                to={`/inventory/${product.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>

      <button className="addHome">
        <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add new product
        </Link>
      </button>
    </div>
    );
};

export default Inventory;