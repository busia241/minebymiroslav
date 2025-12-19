// Эмуляция PHP скрипта для получения скрипта расширения
// Этот скрипт инжектится в игру для перехвата запросов

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // JavaScript код для инжекции в игру
    // Этот код перехватывает fetch запросы и проксирует их через расширение
    const script = `
(function() {
    'use strict';
    
    if (window.fetchPatched) return;
    window.fetchPatched = true;
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const [url, options = {}] = args;
        
        // Проверяем, нужно ли проксировать этот запрос
        if (url.includes('stake-engine.com') || url.includes('wallet')) {
            const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            return new Promise((resolve, reject) => {
                // Отправляем запрос расширению
                window.postMessage({
                    type: 'PROXY_REQUEST_FROM_PAGE',
                    requestId: requestId,
                    payload: {
                        url: url,
                        options: {
                            method: options.method || 'GET',
                            headers: options.headers || {},
                            body: options.body || null
                        }
                    }
                }, '*');
                
                // Слушаем ответ от расширения
                const messageHandler = (event) => {
                    if (event.data.type === 'PROXY_RESPONSE_FROM_EXTENSION' && 
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', messageHandler);
                        
                        const response = event.data.response;
                        
                        if (response.error) {
                            reject(new Error(response.error));
                            return;
                        }
                        
                        // Создаем Response объект
                        resolve(new Response(response.body, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        }));
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                // Таймаут на случай если расширение не ответит
                setTimeout(() => {
                    window.removeEventListener('message', messageHandler);
                    // Fallback на оригинальный fetch
                    resolve(originalFetch(...args));
                }, 5000);
            });
        }
        
        // Для остальных запросов используем оригинальный fetch
        return originalFetch(...args);
    };
})();
    `.trim();

    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(script);
}

