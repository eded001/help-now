const express = require('express');
const path = require('path');

const router = express.Router();
const checkAuth = require('./middlewares/checkAuth.middleware');

const validRoles = ['CLIENT', 'SUPPORT', 'ADMIN'];

// arquivos estáticos (HTML, CSS, JS)
router.use(express.static(path.join(__dirname, '../../../frontend/public')));

// rota principal protegida (redireciona para o HTML conforme role)
router.get('/', checkAuth(validRoles), (req, res) => {
    const { role, name } = req.session.user;

    req.session.message = `Bem-vindo, ${role.toLowerCase()}!`;
    req.session.userData = { role, nome: name };

    if (role === 'SUPPORT') {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/support.html'));
    }

    if (role === 'ADMIN') {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/admin-login.html'));
    }

    // default CLIENT
    return res.sendFile(path.join(__dirname, '../../../frontend/pages/client.html'));
});

// página de cadastro (aberta)
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/register.html'));
});

// página de login (aberta)
router.get('/login', (req, res) => {
    const user = req.session.user;

    if (user && user.role) {
        req.session.message = `Bem-vindo, ${user.username}!`;
        req.session.userData = { role: user.role, nome: user.name };
        return res.redirect('/');
    }

    // não autenticado
    return res.sendFile(path.join(__dirname, '../../../frontend/pages/login.html'));
});

// página de configurações
router.get('/settings', checkAuth(validRoles), (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/settings.html'));
})

// página de avaliação (aberta)
router.get('/evaluation', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/evaluation.html'));
});

// informações de sessão (protegida)
router.get('/session-info', checkAuth(validRoles), (req, res) => {
    res.json({
        name: req.session.user.name,
        role: req.session.user.role,
        message: req.session.message || null,
        userData: req.session.userData || {},
    });
});

module.exports = router;