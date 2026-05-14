const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
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


app.use((err, req, res, next) => {
    if (err) {
        return res.json({ width: 0, height: 0 });
    }
    next();
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running');
});
