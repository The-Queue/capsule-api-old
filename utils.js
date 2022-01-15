require('dotenv').config();
const axios = require('axios').default;
const moment = require('moment');
const qs = require('qs');

const { createClient } = require('redis');

const utils = {

    token: {
        access_token: null,
        token_type: 'bearer',
        expires_in: 0,
        expiration_date: moment().subtract(1, 'day').utc()
    },

    getAuthToken: async function () {
        if (moment(this.expiration_date).isBefore(moment())) {
            console.log('token pas expiré ?');
            return this.token;
        }

        const credential = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
        try {
            const options = {
                method: 'POST',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Basic ${credential}`
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
                })
            };

            const response = await axios.request(options);

            this.token = response.data;
            this.token.expiration_date = moment().add(this.token.expires_in, 'seconds');
            return this.token;
        } catch (e) {
            console.error(e);
            return false;
        }

    },

    async getPlayback() {
        const token = await this.getAuthToken();

        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 204) {
            return false;
        }

        return response.data;
    },

    async getRedisClient() {
        const client = createClient();

        client.on('error', console.error);
        
        await client.connect();

        return client;
    },

    async getFirstInQueue() {
        const client = await utils.getRedisClient();
        const first  = await client.lIndex('queue', 0);

        return JSON.parse(first);
    },

    async popQueue() {
        const client = await utils.getRedisClient();

        await client.blPop('queue', 0);
    },

    async addToQueue(item) {
        const client = await utils.getRedisClient();

        await client.rPush('queue', JSON.stringify(item));
    }

};

module.exports = utils;