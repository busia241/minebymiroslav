module.exports = async function handler(req, res) {
    // Обработка выхода
    if (req.method === 'GET') {
        // Очистка сессии (если используется)
        return res.redirect('/minedrop/?logout=1');
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

