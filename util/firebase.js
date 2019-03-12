const { google } = require('googleapis');

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];
        const key = require('../firebase-service-account.json');
        const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES, null);

        jwtClient.authorize((err, tokens) => err ? reject(err) : resolve(tokens.access_token));
    });
};

module.exports = { getAccessToken };
