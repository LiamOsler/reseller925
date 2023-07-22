var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all parts */
router.get('/', function(req, res, next) {
    db.any(`
        SELECT *
        FROM public.clients925`, [true])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.send(error);
    });
});

router.post('/', function(req, res, next) {
    var clientName = req.body.client_name;
    var clientCity = req.body.client_city;

    db.any(`
        INSERT INTO public.clients925
        (created_at, client_name, client_city)
        VALUES(now(), $1, $2)
        RETURNING client_id, created_at, client_name, client_city;
    `, [clientName, clientCity])
    .then(function(data) {
        console.log(data);
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});
    
/* GET parts by part number */
router.get('/id/:id', function(req, res, next) {
    var clientId = req.params.id;

    db.any(`
        SELECT * 
        FROM public.clients925 
        WHERE "client_id" = $1 
    `, [clientId])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.status(500);
            res.send(error);
    });
});

router.put('/id/:id', function(req, res, next) {
    var clientId = req.params.id;
    var clientName = req.body.client_name;
    var clientCity = req.body.client_city;

    db.any(`
        UPDATE public.clients925
        SET client_name=$2, client_city=$3
        WHERE client_id=$1
        RETURNING client_id, created_at, client_name, client_city;
    `, [clientId, clientName, clientCity])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

router.delete('/id/:id', function(req, res, next) {
    var clientId = req.params.id;

    db.any(`
        DELETE FROM public.clients925
        WHERE client_id=$1
    `, [clientId])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

module.exports = router;