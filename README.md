# CSCI 4140 Assignment 4
**Author:** Liam Osler
**Date:** 2023-07-17
**Course:** CSCI 4140 Advanced Databases, Dalhousie University


## Quick Start:


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
