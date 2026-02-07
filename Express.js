const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const tareasRoutes = require('./routes/tareas');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/auth', authRoutes);

app.use('/tareas', tareasRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Tareas con Auth funcionando! 🎉' });
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Register: POST http://localhost:${PORT}/auth/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/auth/login`);
  console.log(`📝 Tareas: http://localhost:${PORT}/tareas (requiere token)`);
});
