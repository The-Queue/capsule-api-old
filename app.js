require('dotenv').config();

const express = require('express');
const app     = express();
const cors    = require('cors');

const search  = require('./routes/search');
const player  = require('./routes/player');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/search', search);
app.use('/player', player);

app.listen(process.env.PORT, () => {
    console.log(`Écoute sur le port ${process.env.PORT}`);
});