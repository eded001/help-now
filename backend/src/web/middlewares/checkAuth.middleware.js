module.exports =
    function checkAuth(allowedRoles) {
        return (req, res, next) => {
            const user = req.session.user;
            if (!user || !allowedRoles.includes(user.role)) {
                return res.redirect('/login');
            }
            next();
        };
    }