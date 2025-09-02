const express = require("express");
const path = require("path");
const { loadData, saveData } = require("../utils/fileHandler");
const Customer = require("../models/Customer");
const audit = require("../models/Audit");

const router = express.Router();
const file = path.join(__dirname, "../data/customers.json");

router.get("/", (req, res) => {
    res.json(loadData(file));
});

router.post("/", (req, res) => {
    const { name, email } = req.body;
    const customers = loadData(file);
    const newCustomer = new Customer(name, email);
    customers.push(newCustomer.toJSON());
    saveData(file, customers);
    audit.log("CUSTOMER_ADD", `Added ${name}`);
    res.json(newCustomer);
});

router.put("/:id", (req, res) => {
    const customers = loadData(file);
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) return res.status(404).json({ error: "Not found" });

    // merge updates, including products
    Object.assign(customer, req.body);
    saveData(file, customers);

    audit.log("CUSTOMER_UPDATE", `Updated ${customer.name}`);
    res.json(customer);
});


router.delete("/:id", (req, res) => {
    let customers = loadData(file);
    const index = customers.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const removed = customers.splice(index, 1)[0];
    saveData(file, customers);
    audit.log("CUSTOMER_DELETE", `Deleted ${removed.name}`);
    res.json(removed);
});

module.exports = router;