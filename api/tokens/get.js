const { getTokenByCode } = require('../../lib/tokens.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { accessCode } = req.query;
        
        if (!accessCode) {
            return res.status(400).json({ error: 'accessCode is required' });
        }

        const tokenData = getTokenByCode(accessCode);
        
        if (!tokenData || !tokenData.active) {
            return res.status(404).json({ error: 'Invalid or inactive access code' });
        }
        
        return res.status(200).json({
            token: tokenData.token,
            username: tokenData.username
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

