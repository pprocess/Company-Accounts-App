const express = require("express");
const path = require("path");
const { loadData, saveData } = require("../utils/fileHandler");
const Invoice = require("../models/Invoice");
const audit = require("../models/Audit");

const router = express.Router();
const invFile = path.join(__dirname, "../data/invoices.json");
const prodFile = path.join(__dirname, "../data/products.json");

router.get("/", (req, res) => {
    res.json(loadData(invFile));
});

router.post("/", (req, res) => {
    const { customerId, items } = req.body;
    const products = loadData(prodFile);

    let invoiceItems = [];
    items.forEach(({ productId, quantity }) => {
        const prod = products.find(p => p.id === productId);
        if (prod && prod.quantity >= quantity) {
            prod.quantity -= quantity;
            invoiceItems.push({
                productId,
                name: prod.name,
                quantity,
                price: prod.price,
                subtotal: prod.price * quantity
            });
        }
    });

    const invoice = new Invoice(customerId, invoiceItems);
    const invoices = loadData(invFile);
    invoices.push(invoice.toJSON());
    saveData(invFile, invoices);
    saveData(prodFile, products);

    audit.log("INVOICE_CREATE", `Invoice ${invoice.id} created`);
    res.json(invoice);
});

module.exports = router;