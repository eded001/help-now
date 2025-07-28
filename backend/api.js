require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.API_PORT || 5525;

const sequelize = require('./utils/conn');
const UserRoutes = require('./routes/UserRoutes');

sequelize.sync()
    .then(() => {
        console.log('Banco sincronizado');

        app.use(cors());
        app.use(express.json());
        app.use(UserRoutes);

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK' });
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar banco: ', err);
    });