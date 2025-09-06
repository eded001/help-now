module.exports =
    function errorHandler(error, req, res, next) {
        console.error('Erro capturado:', error);

        const status = error.status || 500;
        const message = error.message || 'Erro interno do servidor';

        res.status(status).json({ error: message });
    }