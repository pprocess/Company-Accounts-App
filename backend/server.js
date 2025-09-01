const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/audit", auditRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));