const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

// Настройка multer — файл хранится в памяти
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Принимаем ТОЛЬКО PNG
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Файл должен быть в формате PNG'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // максимум 10 МБ
    }
});

// ==========================================
// Маршрут /login/
// Возвращает ваш логин в MOODLE
// ==========================================
app.get('/login/', (req, res) => {
    // ⚠️ ЗАМЕНИТЕ НА СВОЙ РЕАЛЬНЫЙ ЛОГИН!
    const myLogin = 'ivanov';
    res.json({ login: myLogin });
});

// ==========================================
// Маршрут /size2json/
// Принимает PNG-изображение и возвращает размеры
// ==========================================
app.post('/size2json/', upload.single('image'), async (req, res) => {
    // Проверка: передан ли файл
    if (!req.file) {
        return res.status(400).json({
            error: 'Изображение не найдено. Отправьте PNG-файл в поле "image"'
        });
    }

    try {
        // Получаем размеры из буфера
        const metadata = await sharp(req.file.buffer).metadata();

        // Формат ответа точь-в-точь как в задании
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

// Обработка ошибок
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

// Запуск
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${port}`);
});
