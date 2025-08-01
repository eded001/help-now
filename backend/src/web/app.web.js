const express = require('express');
const path = require('path');

const router = express.Router();

// arquivos estáticos (HTML, CSS, JS)
router.use(express.static(path.join(__dirname, '../../../frontend/public')));

// página principal
router.get('/', (req, res) => {
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
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../../../frontend/pages/register.html'));
});

// página de login admin
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/admin-login.html'));
});

module.exports = router;