// Простое хранилище токенов в памяти
// В продакшене лучше использовать Vercel KV или базу данных

let tokens = new Map();
let accessCodes = new Map();

// Инициализация с дефолтными значениями
tokens.set('default', {
    token: 'f69ce31dbe30f293056e704edca8bef4',
    username: 'Admin',
    createdAt: new Date().toISOString(),
    active: true
});

accessCodes.set('1234567890123456', {
    tokenId: 'default',
    createdAt: new Date().toISOString(),
    active: true
});

function getTokenByCode(accessCode) {
    const codeData = accessCodes.get(accessCode);
    if (!codeData || !codeData.active) {
        return null;
    }
    return tokens.get(codeData.tokenId);
}

function createToken(username, accessCode) {
    const tokenId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = Math.random().toString(36).substr(2, 32) + Math.random().toString(36).substr(2, 32);
    
    tokens.set(tokenId, {
        token: token,
        username: username,
        createdAt: new Date().toISOString(),
        active: true
    });
    
    if (accessCode) {
        accessCodes.set(accessCode, {
            tokenId: tokenId,
            createdAt: new Date().toISOString(),
            active: true
        });
    }
    
    return { tokenId, token, username };
}

function revokeToken(tokenId) {
    const tokenData = tokens.get(tokenId);
    if (tokenData) {
        tokenData.active = false;
        tokens.set(tokenId, tokenData);
        return true;
    }
    return false;
}

function revokeAccessCode(accessCode) {
    const codeData = accessCodes.get(accessCode);
    if (codeData) {
        codeData.active = false;
        accessCodes.set(accessCode, codeData);
        return true;
    }
    return false;
}

function getAllTokens() {
    return Array.from(tokens.entries()).map(([id, data]) => ({
        id,
        ...data
    }));
}

function getAllAccessCodes() {
    return Array.from(accessCodes.entries()).map(([code, data]) => ({
        code,
        ...data,
        tokenData: tokens.get(data.tokenId)
    }));
}

function getTokenById(tokenId) {
    return tokens.get(tokenId);
}

// Экспорт для CommonJS
module.exports = {
    getTokenByCode,
    createToken,
    revokeToken,
    revokeAccessCode,
    getAllTokens,
    getAllAccessCodes,
    getTokenById
};
