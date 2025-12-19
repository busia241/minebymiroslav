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
        let body = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
            body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }
        
        // Копируем заголовки из оригинального запроса
        const headers = { ...req.headers };
        delete headers.host;
        delete headers['content-length'];
        
        if (!headers['content-type'] && body) {
            headers['content-type'] = 'application/json';
        }
        
        // Проксируем запрос
        const response = await fetch(targetUrl, {
            method: req.method || 'GET',
            headers: headers,
            body: body
        });
        
        const responseText = await response.text();
        
        // Пробуем распарсить JSON, если не получается - возвращаем как текст
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = responseText;
        }
        
        // Копируем заголовки ответа
        const responseHeaders = {};
        response.headers.forEach((val, key) => {
            responseHeaders[key] = val;
        });
        
        // Возвращаем ответ
        if (typeof responseData === 'object') {
            res.status(response.status).setHeader('Content-Type', 'application/json').json(responseData);
        } else {
            res.status(response.status).setHeader('Content-Type', response.headers.get('content-type') || 'text/plain').send(responseData);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
}

