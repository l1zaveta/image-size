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
            cb(new Error('Файл должен быть в формате PNG'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


app.get('/login/', (req, res) => {
   
    const myLogin = 'l1zavetkns';

    
    res.setHeader('Content-Type', 'application/json');
  
    res.send(JSON.stringify({ login: myLogin }));
});


app.post('/size2json/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    try {
        const metadata = await sharp(req.file.buffer).metadata();

        
        const result = {
            width: metadata.width,
            height: metadata.height
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));

    } catch (error) {
        res.status(400).json({ error: 'Invalid PNG file' });
    }
});


app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
