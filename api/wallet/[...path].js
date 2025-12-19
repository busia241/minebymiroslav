// Проксирование запросов к игре
// Обрабатывает все пути /wallet/*

module.exports = async function handler(req, res) {
    const { path } = req.query;
    const endpoint = Array.isArray(path) ? path.join('/') : path;
    
    // Определяем финальный endpoint
    let finalEndpoint = '';
    
    if (endpoint.includes('authenticate') || endpoint.includes('init')) {
        finalEndpoint = '/authenticate';
    } else if (endpoint.includes('play') || endpoint.includes('bet')) {
        finalEndpoint = '/play';
    } else if (endpoint.includes('balance')) {
        finalEndpoint = '/balance';
    } else if (endpoint.includes('end-round') || endpoint.includes('finish')) {
        finalEndpoint = '/end-round';
    } else {
        finalEndpoint = '/' + endpoint;
    }
    
    // Здесь можно добавить логику модификации запросов для бонусов
    // Пока просто проксируем на оригинальный сервер игры
    
    const gameApiUrl = 'https://rgs.stake-engine.com';
    const targetUrl = `${gameApiUrl}${finalEndpoint}`;
    
    try {
        // Получаем тело запроса
        const body = req.method !== 'GET' && req.method !== 'HEAD' 
            ? JSON.stringify(req.body) 
            : undefined;
        
        // Проксируем запрос
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: body
        });
        
        const responseData = await response.text();
        
        // Здесь можно модифицировать ответ для добавления бонусов
        // Например, увеличить баланс, изменить результат игры и т.д.
        
        // Возвращаем ответ
        res.status(response.status).json(JSON.parse(responseData));
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
}

