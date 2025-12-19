module.exports = async function handler(req, res) {
    // Проверка метода запроса
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Здесь можно добавить проверку сессии/токена
    // Пока возвращаем статус "active"
    return res.status(200).json({
        status: 'active',
        timestamp: new Date().toISOString()
    });
}

