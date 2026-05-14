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
    res.json({ login: myLogin });
});


app.post('/size2json/', upload.single('image'), async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({
            error: 'Изображение не найдено. Отправьте PNG-файл в поле "image"'
        });
    }

    try {
        
        const metadata = await sharp(req.file.buffer).metadata();

       
        res.json({
            width: metadata.width,
            height: metadata.height
        });

    } catch (error) {
        console.error('Ошибка обработки:', error.message);
        res.status(400).json({
            error: 'Не удалось обработать изображение'
        });
    }
});


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Файл слишком большой. Максимум 10 МБ' });
        }
        return res.status(400).json({ error: `Ошибка загрузки: ${err.message}` });
    }

    if (err) {
        return res.status(400).json({ error: err.message });
    }

    next();
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${port}`);
});
