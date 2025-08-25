require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const UserRoutes = require('../src/api/routes/user.routes');

const app = express();
const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(cors({
    credentials: true,
}));

app.use(express.json());

// rotas de usuário
app.use(UserRoutes);

// health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});