module.exports =
    function authMiddleware(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        }
        res.status(401).json({ error: 'Usuário não autenticado.' });
    }