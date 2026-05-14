const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;


const MONGO_URL = 'mongodb://reader:123321@kodaktor.ru/readusers';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB подключена'))
.catch((err) => console.error('Ошибка подключения к MongoDB:', err));


const userSchema = new mongoose.Schema({
    login: String,
    password: String
});

const User = mongoose.model('User', userSchema, 'users');


app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});


app.get('/login/', (req, res) => {
    res.type('text/plain');
    res.send('l1zavetkns');
});


app.post('/size2json/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.json({ width: 0, height: 0 });
    }
    try {
        const metadata = await sharp(req.file.buffer).metadata();
        return res.json({
            width: metadata.width || 0,
            height: metadata.height || 0
        });
    } catch (error) {
        return res.json({ width: 0, height: 0 });
    }
});

app.post('/insert/', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.type('text/plain').send('Ошибка: нужны login и password');
        }

        const newUser = new User({ login, password });
        await newUser.save();

        res.type('text/plain').send('OK');
    } catch (error) {
        console.error('Ошибка при вставке:', error);
        res.type('text/plain').send('Ошибка');
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port ' + port);
});
