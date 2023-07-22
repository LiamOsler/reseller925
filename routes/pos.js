var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all purchase orders */
router.get('/', function(req, res, next) {
    var companyTable = getCompanyTable(req.query.company_name);

    db.any(`SELECT * FROM public.${companyTable}_pos925`)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.send(error);
        });
});

/* POST a new purchase order */
router.post('/', function(req, res, next) {
    var poCustomer = req.body.po_customer;
    var poDate = req.body.po_date;
    var companyName = req.body.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        INSERT INTO public.${companyTable}_pos925
        (created_at, po_date, client_id)
        VALUES(now(), $1, $2)
        RETURNING po_number, po_date, client_id;
    `, [poDate, poCustomer])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.send(error);
    });
});    

/* GET purchase order by purchase order number */
router.get('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        SELECT * 
        FROM public.${companyTable}_pos925
        WHERE "po_number" = $1;
    `, [poNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.status(500);
        res.send(error);
    });
});

/* GET purchase order lines by purchase order number */
router.get('/number/:number/lines', function(req, res, next) {
    var poNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        SELECT *
        FROM public.${companyTable}_lines925
        WHERE "po_number" = $1;
    `, [poNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

/* GET purchase order report by purchase order number */
router.get('/number/:number/report', function(req, res, next) {
    var poNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        SELECT public.purchaseorder($1);
    `, [poNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

/* UPDATE a purchase order by purchase order number */
router.put('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    var poDate = req.body.po_date;
    var poCustomer = req.body.po_customer;
    var companyName = req.body.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        UPDATE public.${companyTable}_pos925
        SET po_date=$2, client_id=$3
        WHERE po_number=$1;
    `, [poNumber, poDate, poCustomer])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.status(500);
        res.json(error);
    });
});

/* DELETE a purchase order by purchase order number */
router.delete('/number/:number', function(req, res, next) {
    var poNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        DELETE FROM public.${companyTable}_pos925
        WHERE po_number=$1;
    `, [poNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.status(500);
        res.json(error);
    });
});

// Function to get the company-specific table name based on the company name
function getCompanyTable(companyName) {
    // Define the common table prefix for all purchase orders and their lines
    const tablePrefix = "pos925";

    // Concatenate the company name with the table prefix to get the company-specific table name
    return tablePrefix + "_" + companyName.toUpperCase();
}

module.exports = router;
