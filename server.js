require('dotenv').config()

const express = require("express");
const sessions = require("express-session");
const app = express();
const bodyParser = require("body-parser");
var multer = require('multer')
const path = require("path")
const crypto = require("crypto")

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "client", "public", "productImages"))
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return callback(err);

            callback(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

var upload = multer({ storage });

const productRoutes = require("./routes/product_routes");
const categoryRoutes = require("./routes/category_routes");
const supplyingsRoutes = require("./routes/supplying_routes");
const supplierRoutes = require("./routes/supplier_routes");
const salesRoutes = require("./routes/sales_routes");
const clientRoutes = require("./routes/client_routes");
const userRoutes = require("./routes/user_routes");
const sessionRoutes = require("./routes/session_routes");
const imageRoutes = require("./routes/image_routes");
const inventoryRoutes = require("./routes/inventory_routes");
const DolarReferenceRoutes = require("./routes/dolarReference_routes");
const DiscountRoutes = require("./routes/discount_routes");


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));

app.use(upload.single("productImageFile"), productRoutes);
app.use(categoryRoutes);
app.use(supplyingsRoutes);
app.use(supplierRoutes);
app.use(salesRoutes);
app.use(clientRoutes);
app.use(userRoutes);
app.use(sessionRoutes);
app.use(imageRoutes);
app.use(inventoryRoutes);
app.use(DolarReferenceRoutes);
app.use(DiscountRoutes);


app.listen(3001, function () {
    console.log("Server on port 3001");
});