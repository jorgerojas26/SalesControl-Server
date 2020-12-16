require('dotenv').config();

const express = require('express');
const sessions = require('express-session');
const app = express();
const bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const moment = require('moment');
Date.prototype.toJSON = function () {
  return moment(this).format('DD/MM/YYYY hh:mm:ss A');
};

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, 'client', 'build', 'productImages'));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({ storage });

const productRoutes = require('./routes/product_routes');
const categoryRoutes = require('./routes/category_routes');
const supplyingsRoutes = require('./routes/supplying_routes');
const supplierRoutes = require('./routes/supplier_routes');
const salesRoutes = require('./routes/sales_routes');
const clientRoutes = require('./routes/client_routes');
const userRoutes = require('./routes/user_routes');
const sessionRoutes = require('./routes/session_routes');
const imageRoutes = require('./routes/image_routes');
const inventoryRoutes = require('./routes/inventory_routes');
const DolarReferenceRoutes = require('./routes/dolarReference_routes');
const DiscountRoutes = require('./routes/discount_routes');
const DebtRoutes = require('./routes/debt_routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.single('productImageFile'), productRoutes);
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
app.use(DebtRoutes);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.listen(process.env.PORT || 80, function () {
  console.log('Server on port: ' + process.env.PORT || 80);
});
