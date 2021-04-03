const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const orderRouter = require('./routers/orderRouter');
const scretData = require('./secrts');

dotenv.config();

const app = express();

const fileStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'images');
    // },
    filename: (req, file, cb) => {
        //cb(null, new Date().toISOString() + '-' + file.originalname);
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes('image')
    || file.mimetype.includes('video')
    || file.mimetype.includes('audio')
    || file.mimetype.includes('application')
    || file.mimetype.includes('text')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).array('files', 100));
//app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('file'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
    res.send(scretData.PAYPAL_CLIENT_ID);
});
app.get('/api/config/google', (req, res) => {
    res.send(scretData.GOOGLE_API_KEY);
});

const __dirnamee = path.resolve();
app.use(express.static(path.join(__dirnamee, '/frontend/build')));
app.get('/*', (req, res) => {
    let url = path.join(__dirname, '../frontend/build', 'index.html');
    if (!url.startsWith('/app/')){ // since we're on local windows
        url = url.substring(1);
    }
    res.sendFile(url);
});

app.use((err, req, res, next) => {
    let erroroMsg = err.message;
    if(erroroMsg.includes('duplicate key error') && erroroMsg.includes('key: { name')){
       erroroMsg = 'name is exisit.';
    } else if(erroroMsg.includes('duplicate key error') && erroroMsg.includes('key: { email')){
        erroroMsg = 'email is exisit.';
     }
    res.status(500).send({ message:  erroroMsg});
});

mongoose.connect(scretData.MONGODB_URL || 'mongodb://localhost/amazona',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(result => {
    console.log('mongo connected');
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log('server at ');
    });
});

