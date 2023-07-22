var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all lines */
router.get('/', function(req, res, next) {
    var companyTable = getCompanyTable(req.query.company_name);

    db.any(`
        SELECT * 
        FROM public.${companyTable}_lines925
    `)
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
        
});

/* POST a new line */
router.post('/', function(req, res, next) {
    var poNumber = req.body.po_number;
    var partNumber = req.body.part_number;
    var quantity = req.body.line_quantity;
    var price = req.body.price;
    var companyName = req.body.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        INSERT INTO public.${companyTable}_lines925
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

/* GET line by line number */
router.get('/number/:number', function(req, res, next) {
    var lineNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        SELECT *
        FROM public.${companyTable}_lines925
        WHERE "line_number" = $1
    `, [lineNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

/* DELETE a line by line number */
router.delete('/number/:number', function(req, res, next) {
    var lineNumber = req.params.number;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        DELETE FROM public.${companyTable}_lines925
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

/* GET lines by purchase order number */
router.get('/po/:poNumber', function(req, res, next) {
    var poNumber = req.params.poNumber;
    var companyName = req.query.company_name;
    var companyTable = getCompanyTable(companyName);

    db.any(`
        SELECT *
        FROM public.${companyTable}_lines925
        WHERE "po_number" = $1
    `, [poNumber])
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Function to get the company-specific table name based on the company name
function getCompanyTable(companyName) {
    // Define the mapping of company names to table prefixes for lines tables here.
    // For example:
    const companyTableMap = {
        "X": "X_lines925",
        "Y": "Y_lines925",
        // Add more entries as needed for other companies.
    };

    // Return the table name based on the company name, or use a default table name if not found
    return companyTableMap[companyName.toUpperCase()] || "lines925";
}


module.exports = router;
