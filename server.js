/* imports */
const express = require('express');
const https = require('https');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const { sweepRefToken } = require('./subroutines/rtoken-sweep');
const { connectdb } = require('./config/mongodb');
const { interpret } = require('./utils/interpret');

/* init express, dotenv, cronjobs */
const app = express();
dotenv.config();
connectdb();
// sweepRefToken.start();

/* middleswares */
app.use(express.json({limit: '30mb'}));
app.use(cors());

/* all routes start here */
app.use('/api/v1', require('./routes/index'));

/* echo hello */
app.get('/', async (_, res) => res.send('<h3 style="font-family: monospace">Acknowledged, ECHO 3</h3>'));

// Listen http port
const httpsServer = https.createServer({
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt'),
}, app);

httpsServer.listen(443, () => {
    console.log('🗸 Listening on port 443');
});

interpret();
