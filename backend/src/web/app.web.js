require('dotenv').config({ path: '../../.env' });

const express = require('express');
const session = require('express-session');
const path = require('path');
const errorHandler = require('../api/middlewares/errorHandler.middleware');

const app = express();

// sessão
app.use(session({
    secret: "SECRET_KEY", // ou process.env.SECRET_KEY
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.use(errorHandler);

// arquivos estáticos
app.use(express.static(path.join(__dirname, '../../../frontend/public/')));

// página principal
app.get('/', (req, res) => {
    console.log('file requested: ', req.url);

    if (!req.session.user) {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/login.html'));
    }

    if (req.session.user.host) {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/host.html'));
    }

    return res.sendFile(path.join(__dirname, '../../../frontend/pages/client.html'));
});

// página de cadastro
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../../../frontend/pages/register.html'));
});

// página de login admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/admin-login.html'));
});

module.exports = app;