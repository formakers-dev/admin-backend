const express = require('express');
const router = express.Router();
const packagejson = require('../package.json');

router.get('/', (req, res, next) =>{
    // res.sendFile(path.join(__dirname, '../public', 'index.html'));
    res.render('index', { title: 'Fomes Admin Server - ' + process.env.NODE_ENV + ' (' + packagejson.version + ')' });
});

module.exports = router;
