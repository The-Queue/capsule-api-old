require('dotenv').config();
const axios = require('axios').default;
const { Router } = require('express');

const { getAuthToken } = require('../utils');

const router = new Router();

/**
 * Effectuer une recherche auprès de Spotify
 */
router.get('/', async (req, res) => {
    const search = req.query.q;

    let params = new URLSearchParams();
    params.set('type', 'track');
    params.set('q', search);

    const token = await getAuthToken();

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            params: {
                type: 'track',
                q: search,
                limit: 20
            }
        });
        
        console.log(response.data);

        return res.json(response.data);
    } catch(e) {
        return res.status(500).json(e);
    }
});

module.exports = router;