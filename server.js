/* imports */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sweepRefToken } = require('./subroutines/rtoken-sweep');
const { connectdb } = require('./config/mongodb');
const { interpret } = require('./utils/interpret');

/* init express, dotenv, cronjobs */
const app = express();
dotenv.config();
connectdb();
sweepRefToken.start();

/* middleswares */
app.use(express.json({limit: '30mb'}));
app.use(cors());

/* all routes start here */
app.use('/api/v1', require('./routes/index'));

/* echo hello */
app.get('/', async (_, res) => res.send('<h3 style="font-family: monospace">Acknowledged, ECHO 3</h3>'));

app.listen(process.env.PORT, () => {
    console.log(`🗸 Server listening on PORT ${process.env.PORT}`);
});

// interpret();