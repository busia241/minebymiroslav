const { revokeToken, revokeAccessCode } = require('../../lib/tokens.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { tokenId, accessCode } = req.body;
        
        if (tokenId) {
            const revoked = revokeToken(tokenId);
            if (revoked) {
                return res.status(200).json({ success: true, message: 'Token revoked' });
            }
            return res.status(404).json({ error: 'Token not found' });
        }
        
        if (accessCode) {
            const revoked = revokeAccessCode(accessCode);
            if (revoked) {
                return res.status(200).json({ success: true, message: 'Access code revoked' });
            }
            return res.status(404).json({ error: 'Access code not found' });
        }
        
        return res.status(400).json({ error: 'tokenId or accessCode is required' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

