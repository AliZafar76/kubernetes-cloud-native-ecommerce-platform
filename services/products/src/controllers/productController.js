const productRepository = require('../repositories/productRepository');
const productCache = require('../services/productCache');

const getAllProducts = async (req, res) => {
    try {
        const cachedProducts =
            await productCache.getProductsList();

        if (cachedProducts) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                count: cachedProducts.length,
                data: cachedProducts
            });
        }

        const products =
            await productRepository.getAllProducts();

        await productCache.setProductsList(products);

        res.status(200).json({
            success: true,
            source: 'database',
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error(
            'Error fetching products:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const cachedProduct = await productCache.getProduct(id);

        if (cachedProduct) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: cachedProduct
            });
        }

        const product =
            await productRepository.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await productCache.setProduct(product);

        res.status(200).json({
            success: true,
            source: 'database',
            data: product
        });
    } catch (error) {
        console.error(
            'Error fetching product:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        const parsedPrice = Number(price);

        const parsedStockQuantity =
            stock_quantity === undefined
                ? 0
                : Number(stock_quantity);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message:
                    'Price must be a valid non-negative number'
            });
        }

        if (
            !Number.isInteger(parsedStockQuantity) ||
            parsedStockQuantity < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Stock quantity must be a valid non-negative integer'
            });
        }

        const product =
            await productRepository.createProduct({
                name: name.trim(),
                description,
                price: parsedPrice,
                stock_quantity: parsedStockQuantity,
                category,
                image_url
            });

        // Product list cache may now be stale
        await productCache.clearProductsList();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error(
            'Error creating product:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        const parsedPrice = Number(price);

        const parsedStockQuantity =
            stock_quantity === undefined
                ? 0
                : Number(stock_quantity);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message:
                    'Price must be a valid non-negative number'
            });
        }

        if (
            !Number.isInteger(parsedStockQuantity) ||
            parsedStockQuantity < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Stock quantity must be a valid non-negative integer'
            });
        }

        const product =
            await productRepository.updateProduct(
                id,
                {
                    name: name.trim(),
                    description,
                    price: parsedPrice,
                    stock_quantity: parsedStockQuantity,
                    category,
                    image_url
                }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Remove old cached product
        await productCache.deleteProduct(id);

        // Product list cache may also be stale
        await productCache.clearProductsList();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error(
            'Error updating product:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct =
            await productRepository.deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Remove deleted product from Redis
        await productCache.deleteProduct(id);

        // Product list cache may also be stale
        await productCache.clearProductsList();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        console.error(
            'Error deleting product:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};