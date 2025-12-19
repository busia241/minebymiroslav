const { createToken } = require('../../lib/tokens.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, accessCode } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const result = createToken(username, accessCode);
        
        return res.status(200).json({
            success: true,
            tokenId: result.tokenId,
            token: result.token,
            username: result.username,
            accessCode: accessCode || null
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

