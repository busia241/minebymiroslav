const { getAllTokens, getAllAccessCodes } = require('../../lib/tokens.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const tokens = getAllTokens();
        const accessCodes = getAllAccessCodes();
        
        return res.status(200).json({
            tokens,
            accessCodes
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

