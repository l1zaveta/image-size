const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Только PNG'), false);
        }
    },
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

    if (!login || !password || !URL) {
        return res.type('text/plain').send('ERROR: missing parameters');
    }

    try {
       
        const conn = mongoose.createConnection(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        
        await new Promise((resolve, reject) => {
            conn.once('open', () => resolve());
            conn.once('error', (err) => reject(err));
        });

        
        const userSchema = new mongoose.Schema({
            login: String,
            password: String
        });

       
        const User = conn.model('User', userSchema, 'users');

        
        const newUser = new User({ login, password });
        await newUser.save();

      
        await conn.close();

        res.type('text/plain').send('OK');
    } catch (error) {
        console.error('Ошибка insert:', error.message);
        res.type('text/plain').send('ERROR: ' + error.message);
    }
});


app.use((err, req, res, next) => {
    if (err) {
        return res.json({ width: 0, height: 0 });
    }
    next();
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port ' + port);
});
