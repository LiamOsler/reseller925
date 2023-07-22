var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all parts */
router.get('/', function(req, res, next) {
    db.any(`SELECT * FROM public.pos925`, [true])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.send(error);
        });
});

router.post('/', function(req, res, next) {
    var poCustomer = req.body.po_customer;
    var poDate = req.body.po_date;

    db.any(`
        INSERT INTO public.pos925
        (created_at, po_date, client_id)
        VALUES(now(), $1, $2)
        RETURNING po_number, po_date, client_id
        ;
    `, [poDate, poCustomer])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.send(error);
    });
});    

/* GET parts by part number */
router.get('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    db.any(`
        SELECT * 
        FROM public.pos925 
        WHERE "po_number" = $1
        `, [poNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.status(500);
            res.send(error);
        });
});

router.get('/number/:number/lines', function(req, res, next) {
    var poNumber = req.params.number;
    db.any(`
        SELECT *
        FROM public.lines925
        WHERE "po_number" = $1
        `, [poNumber])
    .then(function(data) {
            res.json(data);
        }
    )
    .catch(function(error) {
        res.json(error);
    });
});


router.get('/number/:number/report', function(req, res, next) {
    var poNumber = req.params.number;
    db.any(`
        SELECT public.purchaseorder($1);
        `, [poNumber])
    .then(function(data) {
            res.json(data);
        }
    )
    .catch(function(error) {
        res.json(error);
    });
});

router.put('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    var poDate = req.body.po_date;
    var poCustomer = req.body.po_customer;
    
    db.any(`
        UPDATE public.pos925
        SET  po_date=$2, client_id=$3
        WHERE po_number=$1;
        `, [poNumber, poDate, poCustomer])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        }
    );
});

router.delete('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    
    db.any(`
        DELETE FROM public.pos925
        WHERE po_number=$1;
        `, [poNumber])
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.status(500);
            res.json(error);
        }
    );
});


module.exports = router;
