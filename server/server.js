const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/db');
const nameRoutes = require('./routes/nameRoutes');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.vercel.app']  // Replace with your Vercel frontend URL
        : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to PostgreSQL
// connectDB();

// Routes
app.use('/api/names', nameRoutes);

app.post('/api/grammar-check', (req, res) => {
    const { text } = req.body;
    console.log(req.body)

    const options = {
        method: 'POST',
        hostname: 'grammarbot.p.rapidapi.com',
        port: null,
        path: '/correct',
        headers: {
            'x-rapidapi-key': "9559199014mshd0c81c8db358b23p1eb664jsn55d1b5e444a9'", 
            'x-rapidapi-host': 'textgears-textgears-v1.p.rapidapi.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const apiRequest = https.request(options, (apiResponse) => {
        const chunks = [];

        apiResponse.on('data', (chunk) => {
            chunks.push(chunk);
        });

        apiResponse.on('end', () => {
            const body = Buffer.concat(chunks);
            res.json(JSON.parse(body)); // Send the API response back to the frontend
        });
    });

    apiRequest.on('error', (err) => {
        res.status(500).json({ error: err.message });
    });

    apiRequest.write(qs.stringify({ text }));
    apiRequest.end();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something broke!',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync models with database
        await sequelize.sync();
        console.log('Database models synchronized successfully.');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

startServer();
