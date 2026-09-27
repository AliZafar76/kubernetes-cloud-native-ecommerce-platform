const pool = require('../config/database');

const getAllProducts = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
    `);

    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            created_at,
            updated_at
        FROM products
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const createProduct = async ({
    name,
    description,
    price,
    stock_quantity,
    category,
    image_url
}) => {
    const result = await pool.query(
        `
        INSERT INTO products (
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            created_at,
            updated_at
        `,
        [
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url
        ]
    );

    return result.rows[0];
};

const updateProduct = async (
    id,
    {
        name,
        description,
        price,
        stock_quantity,
        category,
        image_url
    }
) => {
    const result = await pool.query(
        `
        UPDATE products
        SET
            name = $1,
            description = $2,
            price = $3,
            stock_quantity = $4,
            category = $5,
            image_url = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING
            id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            created_at,
            updated_at
        `,
        [
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            id
        ]
    );

    return result.rows[0];
};

const deleteProduct = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM products
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};