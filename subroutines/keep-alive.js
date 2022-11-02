const { CronJob } = require('cron');
const { getLocalTime } = require('../utils/local-time');

exports.keepAlive = new CronJob(
        /* run routine every 5 minutes */
        '*/5 * * * *',
        async () => {
                console.log(`[${getLocalTime()}] Keeping alive...`)
        },
        null,
        false,
        'utc'
);