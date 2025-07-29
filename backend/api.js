require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const sequelize = require('./utils/conn');
const UserRoutes = require('./routes/UserRoutes');

const app = express();
const PORT = process.env.API_PORT || 5515;
const IP = process.env.IP;

app.use(cors({
    credentials: true,
}));

app.use(express.json());

app.use(UserRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

sequelize.sync()
    .then(() => {
        console.log('Banco sincronizado');
        app.listen(PORT, () => {
            console.log(`API rodando em http://${IP}:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar banco:', err);
    });