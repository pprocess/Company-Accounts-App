const express = require("express");
const path = require("path");
const { loadData, saveData } = require("../utils/fileHandler");
const Product = require("../models/Product");
const audit = require("../models/Audit");

const router = express.Router();
const file = path.join(__dirname, "../data/products.json");

router.get("/", (req, res) => {
    const products = loadData(file);
    res.json(products);
});

router.post("/", (req, res) => {
    const { name, price, quantity } = req.body;
    const products = loadData(file);
    const newProduct = new Product(name, price, quantity);
    products.push(newProduct.toJSON());
    saveData(file, products);
    audit.log("PRODUCT_ADD", `Added ${name}`);
    res.json(newProduct);
});

router.put("/:id", (req, res) => {
    const products = loadData(file);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    Object.assign(product, req.body);
    saveData(file, products);
    audit.log("PRODUCT_UPDATE", `Updated ${product.name}`);
    res.json(product);
});

router.delete("/:id", (req, res) => {
    let products = loadData(file);
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const removed = products.splice(index, 1)[0];
    saveData(file, products);
    audit.log("PRODUCT_DELETE", `Deleted ${removed.name}`);
    res.json(removed);
});

module.exports = router;