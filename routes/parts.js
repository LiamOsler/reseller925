var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all parts */
router.get('/', function(req, res, next) {
    db.any(`SELECT part_number, part_name, part_description FROM public.parts925`, [true])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.send(error);
        });
});

router.post('/', function(req, res, next) {
    var partName = req.body.part_name;
    var partDescription = req.body.part_description;
    var quantityOnHand = req.body.quantity_on_hand;

    console.log(partName, partDescription, quantityOnHand);

    db.any(`
        INSERT INTO public.parts925
        (created_at, part_name, part_description, quantity_on_hand)
        VALUES(now(), $1, $2, $3)
        RETURNING part_number, part_name, part_description, quantity_on_hand
        ;
    `, [partName, partDescription, quantityOnHand])
    .then(function(data) {
        console.log(data);
        res.json(data);
    })
    .catch(function(error) {
        console.log(error);
        res.send(error);
    });
});


/* GET parts by part number */
router.get('/number/:number', function(req, res, next) {
    var partNumber = req.params.number;

    db.any(`
        SELECT part_number, part_name, part_description 
        FROM public.parts925 
        WHERE "part_number" = $1 
    `, [partNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.status(500);
            res.send(error);
    });
});

router.put('/number/:number', function(req, res, next) {
    var partNumber = req.params.number;
    var partName = req.body.part_name;
    var partDescription = req.body.part_description;
    var quantityOnHand = req.body.quantity_on_hand;

    db.any(`
        UPDATE public.parts925
        SET part_name=$2, part_description=$3, quantity_on_hand=$4
        WHERE part_number=$1
        RETURNING part_number, part_name, part_description, quantity_on_hand;
    `, [partNumber, partName, partDescription, quantityOnHand])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.status(500);
        res.send(error);
    });
});

router.delete('/number/:number', function(req, res, next) {
    var partNumber = req.params.number;

    db.any(`
        DELETE FROM public.parts925
        WHERE part_number=$1
        RETURNING part_number, part_name, part_description, quantity_on_hand

        ;
    `, [partNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.status(500);
        res.json(error);
    }); 
});

module.exports = router;
