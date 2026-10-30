

const db = require('../config/db');

const getProducts = async () => {
    const result = await db.query(
        'SELECT * FROM products'
    );
    return result.rows;
};

const getProductById = async (id) => {
    const result = await db.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

const createProduct = async (data) => {
    const { name, price } = data;

    const result = await db.query(
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
        [name, price]
    );

    return result.rows[0];
};

const updateProduct = async (id, data) => {
    const { name, price } = data;

    const result = await db.query(
        'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
        [name, price, id]
    );

    return result.rows[0];
};

const deleteProduct = async (id) => {
    const result = await db.query(
        'DELETE FROM products WHERE id = $1 RETURNING id',
        [id]
    );

    return result.rowCount > 0;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
