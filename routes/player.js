require('dotenv').config();
const axios = require('axios').default;
const { Router } = require('express');

const { getAuthToken } = require('../utils');

const router = new Router();

/**
 * Effectuer une recherche auprès de Spotify
 */
router.get('/playing', async (req, res) => {

    const token = await getAuthToken();

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return res.json(response.data);
    } catch(e) {
        return res.status(500).json(e);
    }
});

module.exports = router;