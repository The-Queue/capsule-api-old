const { Router } = require('express');
const axios      = require('axios').default;
const qs         = require('qs');

const { getAuthToken } = require('../utils');

const router = new Router();

router.post('/', async (req, res) => {
    const data = req.body;

    const token = await getAuthToken();
    
    try {
        await axios.request('https://api.spotify.com/v1/me/player/queue', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            params: {
                uri: data.uri
            }
        });

        return res.status(200).json({
            success: true
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: 'Une erreur est survenue lors de l\'ajout du titre à la file d\'attente'
        });
    } 
})

module.exports = router;