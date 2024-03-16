import { React, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const Add = () => {
    const [product, setProduct] = useState({
      name: "",
      quantity: 0,
      price: 0
    });
    const [error,setError] = useState(false)
  
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleClick = async (e) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:8800/api/add-inventory", product);
        navigate("/");
      } catch (err) {
        console.log(err);
        setError(true)
      }
    };
  
    return (
      <div className="form">
        <h1>Add New Book</h1>
        <input
          type="text"
          placeholder="Product name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Product quantity"
          name="quantity"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Product price"
          name="price"
          onChange={handleChange}
        />
        <button onClick={handleClick}>Add</button>
        {error && "Something went wrong!"}
        <Link to="/">See all products</Link>
      </div>
    );
  };
  
  export default Add;