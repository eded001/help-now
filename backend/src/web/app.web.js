const express = require('express');
const path = require('path');

const router = express.Router();

// arquivos estáticos (HTML, CSS, JS)
router.use(express.static(path.join(__dirname, '../../../frontend/public')));

router.get('/', (req, res) => {
    console.log('file requested: ', req.url);
// rota principal protegida (redireciona para o HTML conforme role)

    if (!req.session.user) {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/login.html'));
    }

    if (req.session.user.host) {
        return res.sendFile(path.join(__dirname, '../../../frontend/pages/host.html'));
    }

    // default CLIENT
    return res.sendFile(path.join(__dirname, '../../../frontend/pages/client.html'));
});

// página de cadastro (aberta)
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }

    // não autenticado
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/admin-login.html'));
// informações de sessão (protegida)
});

module.exports = router;