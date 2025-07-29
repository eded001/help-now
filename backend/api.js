require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const sequelize = require('./utils/conn');
const UserRoutes = require('./routes/UserRoutes');
const { initAdminUser } = require('./models/initAdminUser');

const app = express();
const PORT = process.env.API_PORT;
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

sequelize.sync()
    .then(() => {
        console.log('Banco sincronizado');

        app.listen(PORT, () => {
            console.log(`API rodando em http://${IP}:${PORT}`);
        });

        initAdminUser();
    })
    .catch(err => {
        console.error('Erro ao sincronizar banco: ', err);
    });