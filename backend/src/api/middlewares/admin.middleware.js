module.exports =
    function adminMiddleware(req, res, next) {
        if (req.session && req.session.user && req.session.user.role === 'ADMIN') {
            return next();
        }
        res.status(403).json({ error: 'Acesso negado: Admins apenas' });
    }