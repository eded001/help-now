function successResponse(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
}

function errorResponse(res, err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || 'Erro interno' });
}

module.exports = { successResponse, errorResponse };