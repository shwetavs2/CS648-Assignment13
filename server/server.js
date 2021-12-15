const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

const dbURL = "mongodb+srv://test:test123@nodeproject-6ejkm.mongodb.net/test?retryWrites=true&w=majority";

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Product = mongoose.model('product', {
    "id": Number,
    "product": {
       "productid": Number,
       "category": String,
       "price": Number,
       "name": String,
       "instock": Boolean
    }
})

let object = {
    "id": 0,
    "product": {
       "productid": 0,
       "category": "",
       "price": 0,
       "name": "",
       "instock": true
    
    }
}   

let objects = {
    '1': {id: 1, category: 'Music', price: '$500', name: 'Clarinet'},
    '2': {id: 2, category: 'Music', price: '$5,000', name: 'Cello'},
    '3': {id: 3, category: 'Music', price: '$3,500', name: 'Tuba'},
    '4': {id: 4, category: 'Furniture', price: '$709', name: 'Lounge Seat'},
    '5': {id: 5, category: 'Furniture', price: '$1,300', name: 'Table'},
    '6': {id: 6, category: 'Furniture', price: '$100', name: 'Bag'}
};

app.get('/product/get/', function (req, res) {
    Product.find({}, (err, products) => {
        console.log(products)
        res.send(products);
    });
});

app.post('/product/create', function (req, res) {
    const newProduct = req.body.product;
    if(newProduct){
        const product = new Product({
            id: newProduct.id,
            product: {
                productid: newProduct.id,
                category: newProduct.category,
                price: newProduct.price,
                name: newProduct.name,
                instock: !!newProduct.instock
            }
        });
        product.save((err) => {
            if(err){
                res.sendStatus(500);
            }
        });
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});

app.put('/product/update/:id', function (req, res) {
    const id = req.params.id;
    Product.updateOne({ id }, req.body.product, function(err, res) {

    });
    res.sendStatus(200);
});

app.delete('/product/delete/:id', function (req, res) {
    const id = req.params.id;

    if(id){
        Product.deleteOne({ id }, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(500);
    }
});

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log("connected");
})

var server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port);
});
