const express = require('express');
const dotenv = require('dotenv');
const pool = require('./db');

// Импорт маршрутов
const projectRoutes = require('./routes/projectRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Проверка подключения к базе данных
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
})();

app.use('/api/projects', projectRoutes);       // Маршруты для проектов
app.use('/api/payments', paymentRoutes);       // Маршруты для платежей
app.use('/api/comments', commentRoutes);       // Маршруты для комментариев
app.use('/api/rewards', rewardRoutes);         // Маршруты для наград
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);  // Маршруты для уведомлений
app.use('/api/auth', authRoutes);
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
