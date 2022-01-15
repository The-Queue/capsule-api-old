const { Router } = require('express');
const axios      = require('axios').default;
const qs         = require('qs');

const { getAuthToken, getRedisClient, addToQueue } = require('../utils');

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

        await addToQueue({
            name: data.name,
            artists: data.artists.map(artist => artist.name).join(', ')
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
});

/**
 * Liste des musiques en file d'attente
 */
router.get('/', async (req, res) => {
    try {
        const redis = await getRedisClient();
        const queue = await redis.lRange('queue', 0, -1);

        return res.json(queue.map(item => JSON.parse(item)));
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
})

module.exports = router;