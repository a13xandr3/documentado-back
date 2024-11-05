function sendResponse(res, status, data) {
    res.status(status).json(data);
}
function sendError(res, status, errorMessage) {
    res.status(status).json({ error: errorMessage });
}
module.exports = { sendResponse, sendError };