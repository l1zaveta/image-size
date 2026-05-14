const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;


const MONGO_URL = 'mongodb+srv://admin:311202@cluster0.awkqw3q.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.error('Ошибка MongoDB:', err.message));

const userSchema = new mongoose.Schema({
    login: String,
    password: String
});

const User = mongoose.model('User', userSchema, 'users');


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});


app.use(express.urlencoded({ extended: true }));


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
    const { login, password, URL } = req.body;


    if (URL) {
        try {
            await mongoose.disconnect();
            await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Подключились к:', URL);
        } catch (err) {
            return res.send('Ошибка подключения к MongoDB: ' + err.message);
        }
    }

  
    if (!login || !password) {
        return res.send('Ошибка: нужны login и password');
    }

    try {
        const newUser = new User({ login, password });
        await newUser.save();
        res.send('OK');
    } catch (error) {
        res.send('Ошибка при сохранении: ' + error.message);
    }
});


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Ошибка сервера');
});


app.listen(port, '0.0.0.0', () => {
    console.log('Сервер запущен на порту ' + port);
});
