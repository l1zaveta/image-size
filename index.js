const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});


app.get('/login/', (req, res) => {
    res.json({ login: 'l1zavetkns' });
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
    res.json({ width: 0, height: 0 });
});

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port ' + port);
});
