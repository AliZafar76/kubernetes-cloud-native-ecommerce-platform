require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const client = require('prom-client');

const pool = require('./config/database');
const redisClient = require('./config/redis');
const productRoutes = require('./routes/productRoutes');

const app = express();

client.collectDefaultMetrics();

const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/products', productRoutes);

/*
 * Liveness check
 *
 * Purpose:
 * Confirm that the application process is alive.
 *
 * Redis/PostgreSQL are intentionally NOT checked here.
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'products-service'
    });
});

/*
 * Readiness check
 *
 * PostgreSQL is a required dependency.
 * Redis is optional because the application can
 * continue serving requests directly from PostgreSQL.
 */
app.get('/ready', async (req, res) => {
    let databaseStatus = 'DOWN';
    let redisStatus = 'DOWN';

    try {
        await pool.query('SELECT 1');
        databaseStatus = 'UP';
    } catch (error) {
        console.error(
            'Readiness check - PostgreSQL failed:',
            error.message
        );
    }

    if (redisClient.isReady) {
        redisStatus = 'UP';
    }

    const isReady = databaseStatus === 'UP';

    res.status(isReady ? 200 : 503).json({
        status: isReady ? 'READY' : 'NOT_READY',
        service: 'products-service',
        dependencies: {
            database: databaseStatus,
            redis: redisStatus
        }
    });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.get('/', (req, res) => {
    res.json({
        message: 'Products Service is running'
    });
});

let server;

const startServer = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected successfully');

        await redisClient.connect();
        console.log('Redis connection verified successfully');

        server = app.listen(PORT, () => {
            console.log(
                `Products Service running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            'Application startup failed:',
            error.message
        );

        process.exit(1);
    }
};

/*
 * Graceful shutdown
 *
 * Kubernetes normally sends SIGTERM before terminating
 * a Pod. We close the HTTP server first, then Redis
 * and PostgreSQL connections.
 */
const gracefulShutdown = async (signal) => {
    console.log(
        `\n${signal} received. Starting graceful shutdown...`
    );

    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
        });
    }

    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            console.log('Redis connection closed');
        }
    } catch (error) {
        console.error(
            'Error closing Redis connection:',
            error.message
        );
    }

    try {
        await pool.end();
        console.log('PostgreSQL connection pool closed');
    } catch (error) {
        console.error(
            'Error closing PostgreSQL pool:',
            error.message
        );
    }

    console.log('Graceful shutdown completed');
    process.exit(0);
};

process.on('SIGTERM', () => {
    gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
    gracefulShutdown('SIGINT');
});

startServer();