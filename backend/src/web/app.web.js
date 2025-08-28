const express = require('express');
const path = require('path');
const router = express.Router();

const checkAuth = require('./middlewares/checkAuth.middleware');

const validRoles = ['CLIENT', 'SUPPORT', 'ADMIN'];

// arquivos estáticos
router.use(express.static(path.join(__dirname, '../../../frontend/public')));

// rota principal protegida
router.get('/', checkAuth(validRoles), (req, res) => {
    const { role } = req.session.user;

    if (role === 'SUPPORT') {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/support.html'));
    }
    if (role === 'ADMIN') {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/admin-login.html'));
    }

    return res.sendFile(path.join(__dirname, '../../../frontend/pages/client.html'));
});

// página de cadastro
router.get('/register', (req, res) => {
    const user = req.session.user;

    if (user) {
        req.session.userData = { role: user.role, nome: user.name };
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../../../frontend/pages/register.html'));
});

// página de login
router.get('/login', (req, res) => {
    const user = req.session.user;

    if (user) {
        req.session.userData = { role: user.role, nome: user.name };
        return res.redirect('/');
    }

    return res.sendFile(path.join(__dirname, '../../../frontend/pages/login.html'));
});

// página de configurações
router.get('/settings', checkAuth(validRoles), (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/settings.html'));
});

// página de avaliação
router.get('/evaluation', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/evaluation.html'));
});

// informações de sessão
router.get('/session-info', checkAuth(validRoles), (req, res) => {
    res.json({
        name: req.session.user.name,
        department: req.session.user.department,
        username: req.session.user.username
    });
});

module.exports = router;