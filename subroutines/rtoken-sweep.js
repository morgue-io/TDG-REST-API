const { CronJob } = require('cron');
const { rtokenSchema } = require('../schemas/rtoken');

exports.sweepRefToken = new CronJob(
        /* run routine at 09:00:00 everyday */
        '0 9 * * *',
        async () => {
                try {
                        const query = { expire_at: { $lt: Date.now() } };
                        await rtokenSchema.deleteMany(query);
                } catch (e) {
                        console.error(e);
                }
        },
        null,
        false,
        'utc'
);