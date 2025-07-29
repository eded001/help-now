require('dotenv').config({ path: './.env' });

const express = require('express');
const session = require('express-session');
const path = require('path');

const UserRoutes = require('./routes/UserRoutes');
const AdminRoutes = require('./routes/AdminRoutes');

const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.use(express.static(path.join(__dirname, '../public/')));

// rotas públicas
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.sendFile(path.join(__dirname, '../public/pages/client.html'));
    } else if (req.session.user.host) {
        return res.sendFile(path.join(__dirname, '../public/pages/host.html'));
    }

    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../public/pages/register.html'));
});

app.use('/admin', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/pages/login/admin-login.html'));
});

// Rotas da API
app.use('/api/user', UserRoutes);

// Rotas admin protegidas com middlewares
app.use('/api/admin', authMiddleware, adminMiddleware, AdminRoutes);

const IP = process.env.IP;
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://${IP}:${PORT}`);
});