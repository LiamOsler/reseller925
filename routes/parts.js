var express = require('express');
var router = express.Router();

var db = require('../database/db');

/* GET all parts */
router.get('/', function(req, res, next) {
    // Get the company-specific table name based on the company ID
    var companyTable = getCompanyTable(req.query.company_id);

    // Query the database to fetch all parts from the appropriate table
    db.any(`SELECT part_number, part_name, part_description FROM public.${companyTable}`)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            res.send(error);
        });
});

/* POST a new part */
router.post('/', function(req, res, next) {
    // Extract the data from the request body
    var partName = req.body.part_name;
    var partDescription = req.body.part_description;
    var quantityOnHand = req.body.quantity_on_hand;
    var companyId = req.body.company_id;

    // Get the company-specific table name based on the company ID
    var companyTable = getCompanyTable(companyId);

    console.log(partName, partDescription, quantityOnHand, companyId);

    // Insert the new part into the appropriate company-specific table
    db.any(`
        INSERT INTO public.${companyTable}
        (created_at, part_name, part_description, quantity_on_hand)
        VALUES(now(), $1, $2, $3)
        RETURNING part_number, part_name, part_description, quantity_on_hand;
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
    // Extract the part number and company ID from the request
    var partNumber = req.params.number;
    var companyId = req.query.company_id;

    // Get the company-specific table name based on the company ID
    var companyTable = getCompanyTable(companyId);

    // Query the database to fetch the part with the given part number from the appropriate table
    db.any(`
        SELECT part_number, part_name, part_description 
        FROM public.${companyTable}
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

/* UPDATE a part by part number */
router.put('/number/:number', function(req, res, next) {
    // Extract the part number and company ID from the request
    var partNumber = req.params.number;
    var partName = req.body.part_name;
    var partDescription = req.body.part_description;
    var quantityOnHand = req.body.quantity_on_hand;
    var companyId = req.body.company_id;

    // Get the company-specific table name based on the company ID
    var companyTable = getCompanyTable(companyId);

    // Update the part in the appropriate company-specific table based on the part number
    db.any(`
        UPDATE public.${companyTable}
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

/* DELETE a part by part number */
router.delete('/number/:number', function(req, res, next) {
    // Extract the part number and company ID from the request
    var partNumber = req.params.number;
    var companyId = req.query.company_id;

    // Get the company-specific table name based on the company ID
    var companyTable = getCompanyTable(companyId);

    // Delete the part from the appropriate company-specific table based on the part number
    db.any(`
        DELETE FROM public.${companyTable}
        WHERE part_number=$1
        RETURNING part_number, part_name, part_description, quantity_on_hand;
    `, [partNumber])
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
    // Define the mapping of company names to table prefixes here.
    // For example:
    const companyTableMap = {
        "X": "X_parts925",
        "Y": "Y_parts925",
        // Add more entries as needed for other companies.
    };

    // Return the table name based on the company name, or use a default table name if not found
    return companyTableMap[companyName.toUpperCase()] || "parts925";
}

module.exports = router;
