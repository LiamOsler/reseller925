# CSCI 4140 Assignment 4
**Author:** Liam Osler
**Date:** 2023-07-17
**Course:** CSCI 4140 Advanced Databases, Dalhousie University


## Quick Start:

## Quick Start:
Repository:

Public Github repo for ease of access:

Replit deploy (includes documentation and GUI):


### Run on Repl.it:

1. Navigate to [https://repl.it/github/liamo2/postgres-express-rest](https://repl.it/github/liamo2/postgres-express-rest)
2. Wait for the repl to start
3. Use the REPLIT webview URL as the base URL for the REST API (See examples with CURL below), or visit the index page to interact with the database using the database.

### Run Locally:

1. Clone the repository: 
    `git clone https://github.com/LiamOsler/reseller925.git`
2. Import the postgres database dump from `dump.sql` to your postgres database
3. Set the .env file to the correct database url and password
4. Install dependencies: 
   `npm install`
5. Start the server: `npm start`
6. Navigate to [`http://localhost:4000`](http://localhost:4000) to see the index page and read this documentation.
7. Use the API and GUI to interact with the database with the base URL 
   [`http://localhost:4000`](http://localhost:4000)
   e.g. 
   [`http://localhost:4000/parts`](http://localhost:4000/parts)
## Description:
Create a web application that allows users to create, read, update and delete (CRUD) data from a Purchase Order database.

Clients are able to 
- List parts
- Prepare a purchase order
- Submit a purchase order for a number of parts
- Query the status of a purchase order

- Lists parts for sale
  - Returns list of parts, including part number, description, etc
  - Excludes quantity on hand, etc
- Find information about a specific part given the part number
- List information about purchase orders
- Prepare a purchase order
    - User enters information about the purchase order, including part number, quantity, etc.
- Submit a purchase order by invocation of a method that takes the purchase order number as a parameter.

- Companies X, Y and Z are able to
  - List parts
  - Prepare a purchase order
  - Submit a purchase order for a number of parts
  - Query the status of a purchase order

- Company Z:
  - PObtains a list of parts offered by Company X and Company Y
  - Price is derived from the list price of the part multiplied by a markup factor of 10%

- Parts:
  - Part tables are stored in a database
  - Part table columns are standardized across all companies
  - No mapping of parts between companies is required
  
- Clients:
  - View the list of parts offered by Company X and Company Y as a single list
  - User does not need to know which company offers the part
  - May submit a purchase order for a number of parts

- Purchase orders:
  - Purchase orders are generated for each company from which parts are ordered
  - Purchase orders for company X and Y are derived from the purchase order submitted by the client to company Z.

## API Documentation:

### Companies:

#### Path: '/companies/:id/parts'
Methods: ['GET']

**GET:** Returns a list of parts offered by a specific company (Company X or Company Y).

```bash
curl --request GET \
  --url http://localhost:4000/companies/X/parts
```

### Parts:

#### Path: '/parts'
Methods: ['GET', 'POST']

**GET:** Returns a list of parts for sale from all companies. This list includes part number, description, etc., but excludes quantity on hand, etc.

```bash
curl --request GET \
  --url http://localhost:4000/parts
```

**POST:** Create a new part for a specific company.

POST body:
| Key                | Value |
| ------------------ | ----- |
| `company_id`       | int   |
| `part_name`        | text  |
| `part_description` | text  |
| `quantity_on_hand` | int   |

The `company_id` field indicates which company is adding the part. The `part_number` is automatically generated, and the new part or an error is returned.

```bash
curl --request POST \
  --url http://localhost:4000/parts \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1&part_name=Ryzen 3600x&part_description=Ryzen 5 Processor&quantity_on_hand=10'
```

#### Path: '/parts/number/:number'
Methods: ['GET', 'PUT', 'DELETE']

**GET:** Returns a part given the part number.

```bash
curl --request GET \
  --url http://localhost:4000/parts/number/1
```

**PUT:** Update a part given the part number.

PUT body:
| Key                | Value |
| ------------------ | ----- |
| `company_id`       | int   |
| `part_name`        | text  |
| `part_description` | text  |
| `quantity_on_hand` | int   |

```bash
curl --request PUT \
  --url http://localhost:4000/parts/number/1 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1&part_name=Ryzen 3600x&part_description=Ryzen 5 Processor&quantity_on_hand=20'
```

**DELETE:** Deletes a part given the part number and the company ID.

```bash
curl --request DELETE \
  --url http://localhost:4000/parts/number/1 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

To include companies in the API routes, we need to add the necessary fields to identify the company associated with each purchase order and purchase order line. Below are the modified API routes with added company-related fields:

### Purchase Orders:

#### Path: '/pos'
Methods: ['GET', 'POST']

**GET:** Returns a list of purchase orders for the authenticated company.

```bash
curl --request GET \
  --url http://localhost:4000/pos \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**POST:** Create a new purchase order for the authenticated company.

POST body:
| Key         | Value   |
| ----------- | ------- |
| `client_id` | int     |
| `po_date`   | date    |
| `company_id`| int     |

`po_number` is automatically generated.

```bash
curl --request POST \
  --url http://localhost:4000/pos \
  --header 'content-type: application/x-www-form-urlencoded' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --data 'client_id=1&po_date=2021-01-01&company_id=1'
```

#### Path: '/pos/number/:number'
Methods: ['GET', 'PUT', 'DELETE']

**GET:** Returns a purchase order given the purchase order number and the company ID.

```bash
curl --request GET \
  --url http://localhost:4000/pos/number/1001 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

**PUT:** Update a purchase order given the purchase order number and the company ID.

PUT body:
| Key         | Value   |
| ----------- | ------- |
| `po_number` | int     |
| `client_id` | int     |
| `po_date`   | date    |
| `company_id`| int     |

```bash
curl --request PUT \
  --url http://localhost:4000/pos/number/1001 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'client_id=1&po_date=2021-01-01&company_id=1'
```

**DELETE:** Delete a purchase order given the purchase order number and the company ID.

```bash
curl --request DELETE \
  --url http://localhost:4000/pos/number/1001 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

#### Path: '/pos/number/:number/:company_id/report'
Methods: ['GET']

**GET:** Returns a report of a purchase order given the purchase order number and the company ID.

```bash
curl --request GET \
  --url http://localhost:4000/pos/number/1001/X/report \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

### Purchase Order Lines:

#### Path: '/pos/number/:number/:company_id/lines'
Methods: ['GET']

**GET:** Returns a list of purchase order lines given the purchase order number and the company ID.

```bash
curl --request GET \
  --url http://localhost:4000/pos/number/1001/Y/lines \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

#### Path: '/lines/:company_id'
Methods: ['GET', 'POST']

**GET:** Returns a list of purchase order lines for the authenticated company.

```bash
curl --request GET \
  --url http://localhost:4000/lines \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**POST:** Create a new purchase order line for the authenticated company.

POST body:
| Key           | Value   |
| ------------- | ------- |
| `po_number`   | int     |
| `part_number` | int     |
| `quantity`    | int     |
| `line_price`  | numeric |
| `company_id`  | int     |

`line_number` is automatically generated.

```bash
curl --request POST \
  --url http://localhost:4000/lines \
  --header 'content-type: application/x-www-form-urlencoded' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --data 'po_number=1001&part_number=1&quantity=10&line_price=100.00&company_id=1'
```

#### Path: '/lines/number/:number/:company_id'
Methods: ['GET', 'DELETE']

**GET:** Returns a purchase order line given the purchase order line number and the company ID.

```bash
curl --request GET \
  --url http://localhost:4000/lines/number/1 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

**DELETE:** Delete a purchase order line given the purchase order line number and the company ID.

```bash
curl --request DELETE \
  --url http://localhost:4000/lines/number/1 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

#### Path: '/lines/po/:poNumber/:company_id'
Methods: ['GET']

**GET:** Returns a list of purchase order lines given the purchase order number and the company ID.

```bash
curl --request GET \
  --url http://localhost:4000/lines/po/1001 \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'company_id=1'
```

By including the `company_id` field in the API routes, the application can now handle requests and responses based on the authenticated company's context. Ensure that the appropriate authentication and authorization mechanisms are in place to secure these routes.



### Clients:

#### path: '/clients'
methods: [ 'GET', 'POST' ]

**GET:** Returns a list of clients

```bash
curl --request GET \
  --url http://localhost:4000/clients
```

```bash
curl --request GET \
  --url https://postgres-express-rest.liamo2.repl.co/clients
```

**POST:**   Create a new client

POST body: 
|Key|Value|
|---|---|
|`client_name`   | text |
|`client_city` | text  |

client_id is automatically generated.

```bash
curl --request POST \
  --url http://localhost:4000/clients \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'client_name="John Doe"&client_city="New York"'
```

```bash
curl --request POST \
  --url https://postgres-express-rest.liamo2.repl.co/clients \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'client_name="John Doe"&client_city="New York"'
```


#### path: '/clients/id/:id',
methods: [ 'GET', 'PUT', 'DELETE' ]

**GET:** Returns a client given the client id

```bash
curl --request GET \
  --url http://localhost:4000/clients/id/1
```

```bash
curl --request GET \
  --url https://postgres-express-rest.liamo2.repl.co/clients/id/1
```
