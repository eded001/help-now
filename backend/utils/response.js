function successResponse(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
}

function errorResponse(res, error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || 'Erro interno' });
}

module.exports = { successResponse, errorResponse };