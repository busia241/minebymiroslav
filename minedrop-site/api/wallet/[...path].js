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
        
        let responseText = await response.text();
        
        // Модификация ответа для бонусов
        try {
            let responseData = JSON.parse(responseText);
            
            // Если это ответ с балансом - увеличиваем его
            if (responseData.balance !== undefined && typeof responseData.balance === 'number') {
                responseData.balance = responseData.balance * 1.5; // +50% бонус
            }
            
            // Если это ответ с выигрышем - увеличиваем его
            if (responseData.win !== undefined && typeof responseData.win === 'number') {
                responseData.win = responseData.win * 2; // x2 выигрыш
            }
            
            // Если это ответ с результатом игры
            if (responseData.result) {
                // Можно изменить результат для всегда выигрыша
                if (responseData.result.win !== undefined) {
                    responseData.result.win = responseData.result.win * 2;
                }
            }
            
            responseText = JSON.stringify(responseData);
        } catch (e) {
            // Если не JSON, оставляем как есть
        }
        
        // Копируем заголовки ответа
        const responseHeaders = {};
        response.headers.forEach((val, key) => {
            responseHeaders[key] = val;
        });
        
        // Возвращаем ответ
        try {
            const jsonData = JSON.parse(responseText);
            res.status(response.status).setHeader('Content-Type', 'application/json').json(jsonData);
        } catch (e) {
            res.status(response.status).setHeader('Content-Type', response.headers.get('content-type') || 'text/plain').send(responseText);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
}

