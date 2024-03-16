const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the SQL db
const db = new sqlite3.Database('inventory.sqlite3');

app.get("/", (req, res) => {
    res.json("Hi! This is the backend.")
})

// List out all product data
app.get('/api/inventory', (req, res) => {
    let select = 
        `SELECT p.id, p.name, s.name AS supplier, c.name AS category, p.price, p.quantity 
         FROM product p 
         JOIN supplier s ON(s.id = p.supplier) 
         JOIN category c ON(c.id = p.category)`;
    let filter = [];
    let value = [];

    if (req.query.name) {
        filter.push("UPPER(p.name) LIKE ?");
        value.push('%' + req.query.name.toUpperCase() + '%');
    };

    if (req.query.supplier) {
        filter.push("UPPER(supplier) LIKE ?");
        value.push('%' + req.query.supplier.toUpperCase() + '%');
    };

    if (req.query.category) {
        filter.push("UPPER(category) LIKE ?");
        value.push('%' + req.query.category.toUpperCase() + '%');
    };

    if (req.query.quantityMin) {
        const quantityMin = parseInt(req.query.quantityMin);
        if (!isNaN(quantityMin)) {   
            filter.push("quantity >= ?");
            value.push(quantityMin);
        };
    };

    if (req.query.quantityMax) {
        const quantityMax = parseInt(req.query.quantityMax);
        if (!isNaN(quantityMax)) {   
            filter.push("quantity <= ?");
            value.push(quantityMax);
        };
    };

    if (req.query.priceMin) {
        const priceMin = parseInt(req.query.priceMin);
        if (!isNaN(priceMin)) {   
            filter.push("price >= ?");
            value.push(priceMin);
        };
    };

    if (req.query.priceMax) {
        const priceMax = parseInt(req.query.priceMax);
        if (!isNaN(priceMax)) {   
            filter.push("price <= ?");
            value.push(priceMax);
        };
    };

    if (filter.length > 0) {
        select += " WHERE " + filter.join(" AND ");
    };

    if (req.query.sortBy || req.query.OrderBy) {
        const Columns = ['id', 'name', 'supplier', 'category', 'price', 'quantity'];
        if (Columns.includes(req.query.sortBy)) {
            if (req.query.sortBy === 'id' || req.query.sortBy === 'name') {
                select += ` ORDER BY p.${req.query.sortBy}`;
            } else {
                select += ` ORDER BY ${req.query.sortBy}`;
            }
        } else {
            select += ` ORDER BY id`
        };

        if (req.query.OrderBy === 'desc') {
            select += " DESC";
        } else {
            select += " ASC";
        };
    };

    db.all(select, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.json(err);
        };

        return res.json(rows);
    });
});

app.get('/api/inventory/:id', (req, res) => {
    let select = 
        `SELECT p.id, p.name, p.price, p.quantity, 
        s.name AS supplier_name, s.phone_number AS supplier_phoneNumber, s.email AS supplier_email, s.postcode || ', ' || s.city || ', ' || s.state AS supplier_address,
        c.name AS category_name, c.description AS category_description
         FROM product p 
         JOIN supplier s ON(s.id = p.supplier) 
         JOIN category c ON(c.id = p.category)
         WHERE p.id = ?`;
    const productId = req.params.id;
    
    db.get(select, [productId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.json(err);
        };

        return res.json(row);
    });
});

app.post('/api/add-inventory', (req, res) => {
    let insert = `INSERT INTO product (name, supplier, category, quantity, price)`;

    const values = [
        req.body.name,
        req.body.supplier,
        req.body.category,
        req.body.quantity,
        req.body.price
    ];

    db.run(insert, [values], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.json(err);
        };

        return res.json(row);
    });
});

app.delete('/api/delete-inventory', (req, res) => {
    let del = `DELETE FROM product WHERE id = ?`;

    const productId = req.body.id;

    db.run(insert, [values], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.json(err);
        };

        return res.json(row);
    });
});

app.put('/api/update-inventory', (req, res) => {
    let update = `UPDATE product SET name = ?, supplier = ?, category = ?, quantity = ?, price = ? WHERE id = ?`;

    const productId = req.body.id;
    const values = [
        req.body.name,
        req.body.supplier,
        req.body.category,
        req.body.quantity,
        req.body.price
    ];

    db.run(insert, [...values, productId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.json(err);
        };

        return res.json(row);
    });
});

app.listen(8800, () => {
    console.log("Connected to backend!")
});