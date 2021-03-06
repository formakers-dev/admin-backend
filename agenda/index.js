const Agenda = require('agenda');
const config = require('../config');
const NotiService = require('../services/noti');

const agenda = new Agenda({
    db: {
        address: config.agendaDbUrl,
        collection: 'admin-jobs',
    }
});

// jobs
agenda.define('Request notifications', (job, done) => {
    console.log('[job] Request notifications (' + new Date() + ')\ndata=', JSON.stringify(job.attrs.data));

    NotiService.request(job.attrs.data.receivers, job.attrs.data.data)
        .then(result => {
            console.log(result);
            job.remove();

            done();
        })
        .catch(err => {
            console.error(err);
            job.remove();

            done(err);
        })
});


agenda.define('Request notifications by topic', (job, done) => {
    console.log('[job] Request notifications by topic (' + new Date() + ')\ndata=', JSON.stringify(job.attrs.data));

    NotiService.requestByTopic(job.attrs.data.topic, job.attrs.data.data)
        .then(result => {
            console.log(result);
            job.remove();

            done();
        })
        .catch(err => {
            console.error(err);
            job.remove();

            done(err);
        })
});

agenda.on('ready', () => {
    console.log('agenda start!');
    agenda.start();
});

module.exports = agenda;
