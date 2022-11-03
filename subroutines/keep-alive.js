const { CronJob } = require('cron');
const { getLocalTime } = require('../utils/local-time');
const fetch = require('node-fetch')

exports.keepAlive = new CronJob(
        /* run routine every 5 minutes */
        '*/5 * * * *',
        async () => {
            try {
                var res = await fetch('https://thedhobighat.co.in', { method: 'GET' });
                console.log(`[${getLocalTime()}] [${res.status}] Keeping alive...`);
            } catch (e) {
                console.error(e)
            }
        },
        null,
        false,
        'utc'
);