var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all lines */
router.get('/', function(req, res, next) {
    db.any(`
            SELECT * 
            FROM public.lines925
        `, [true])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.json(error);
        });
        
});

router.post('/', function(req, res, next) {
    var poNumber = req.body.po_number;
    var partNumber = req.body.part_number;
    var quantity = req.body.line_quantity;
    var price = req.body.price;

    db.any(`
        INSERT INTO public.lines925
        (created_at, po_number, part_number, line_quantity, line_price)
        VALUES(now(), $1, $2, $3, $4)
        RETURNING po_number, part_number, line_quantity, line_price;
    `, [poNumber, partNumber, quantity, price])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        console.log(error);
        res.json(error);
    });
});

router.get('/number/:number', function(req, res, next) {
    var lineNumber = req.params.number;

    db.any(`
        SELECT *
        FROM public.lines925
        WHERE "line_number" = $1
    `, [lineNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.json(error);
    });
});

router.delete('/number/:number', function(req, res, next) {
    var lineNumber = req.params.number;

    db.any(`
        DELETE FROM public.lines925
        WHERE "line_number" = $1
        RETURNING po_number, part_number, line_quantity, line_price;
    `, [lineNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.json(error);
    });
});


router.get('/po/:poNumber', function(req, res, next) {
    var poNumber = req.params.poNumber;

    db.any(`
        SELECT *
        FROM public.lines925
        WHERE "po_number" = $1
    `, [poNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.json(error);
    });
});







module.exports = router;
