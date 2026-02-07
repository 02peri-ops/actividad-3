const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const tareasRoutes = require('./routes/tareas');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas públicas (autenticación)
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/tareas', tareasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Tareas con Auth funcionando! 🎉' });
});

// Middleware de errores (siempre al final)
app.use(errorHandler);

// 404 para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Register: POST http://localhost:${PORT}/auth/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/auth/login`);
  console.log(`📝 Tareas: http://localhost:${PORT}/tareas (requiere token)`);
});
