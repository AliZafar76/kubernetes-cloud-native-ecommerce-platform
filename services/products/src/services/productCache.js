const redisClient = require('../config/redis');

const getProductCacheKey = (id) => `product:${id}`;
const PRODUCTS_LIST_CACHE_KEY = 'products:all';

const isRedisAvailable = () => {
    return redisClient.isReady;
};

const getProduct = async (id) => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping product cache read');
        return null;
    }

    try {
        const key = getProductCacheKey(id);
        const cachedProduct = await redisClient.get(key);

        if (!cachedProduct) {
            console.log(`Cache MISS: ${key}`);
            return null;
        }

        console.log(`Cache HIT: ${key}`);

        return JSON.parse(cachedProduct);
    } catch (error) {
        console.error(
            'Redis product cache read failed:',
            error.message
        );

        return null;
    }
};

const setProduct = async (product) => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping product cache write');
        return;
    }

    try {
        const key = getProductCacheKey(product.id);

        await redisClient.set(
            key,
            JSON.stringify(product),
            {
                EX: 300
            }
        );

        console.log(`Product cached: ${key}`);
    } catch (error) {
        console.error(
            'Redis product cache write failed:',
            error.message
        );
    }
};

const deleteProduct = async (id) => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping product cache delete');
        return;
    }

    try {
        const key = getProductCacheKey(id);

        await redisClient.del(key);

        console.log(`Product cache deleted: ${key}`);
    } catch (error) {
        console.error(
            'Redis product cache delete failed:',
            error.message
        );
    }
};

const getProductsList = async () => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping products list cache read');
        return null;
    }

    try {
        const cachedProducts = await redisClient.get(
            PRODUCTS_LIST_CACHE_KEY
        );

        if (!cachedProducts) {
            console.log(
                `Cache MISS: ${PRODUCTS_LIST_CACHE_KEY}`
            );

            return null;
        }

        console.log(
            `Cache HIT: ${PRODUCTS_LIST_CACHE_KEY}`
        );

        return JSON.parse(cachedProducts);
    } catch (error) {
        console.error(
            'Redis products list cache read failed:',
            error.message
        );

        return null;
    }
};

const setProductsList = async (products) => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping products list cache write');
        return;
    }

    try {
        await redisClient.set(
            PRODUCTS_LIST_CACHE_KEY,
            JSON.stringify(products),
            {
                EX: 60
            }
        );

        console.log(
            `Products list cached: ${PRODUCTS_LIST_CACHE_KEY}`
        );
    } catch (error) {
        console.error(
            'Redis products list cache write failed:',
            error.message
        );
    }
};

const clearProductsList = async () => {
    if (!isRedisAvailable()) {
        console.warn('Redis unavailable: skipping products list cache delete');
        return;
    }

    try {
        await redisClient.del(PRODUCTS_LIST_CACHE_KEY);

        console.log(
            `Products list cache deleted: ${PRODUCTS_LIST_CACHE_KEY}`
        );
    } catch (error) {
        console.error(
            'Redis products list cache delete failed:',
            error.message
        );
    }
};

module.exports = {
    getProduct,
    setProduct,
    deleteProduct,
    getProductsList,
    setProductsList,
    clearProductsList
};