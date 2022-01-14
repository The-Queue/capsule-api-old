require('dotenv').config();
const axios = require('axios').default;
const moment = require('moment');
const qs = require('qs');

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
                    cookie: '__Host-device_id=AQBpNpsP2HC-cfQP6w9h_ms_6KmfzOjPcTkJAj1MjzVc2Ezdi8OKJDHE6Z6RrpgIEPDLWjkrykWmlKgDIox2v7poe1RmDw-ykoQ; sp_tr=false',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                    Authorization: 'Basic OTZjNjRhZmJiMmU0NDMyOGJjNjc1MzFmOWNhZDY0Y2E6YmE0MDY0OWI3MmJhNGNjNDk5NTAwNTJmZTc4MmIzMzk='
                },
                data: qs.stringify({
                    grant_type: 'client_credentials'
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

    }

}

module.exports = utils;