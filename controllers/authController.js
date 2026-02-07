const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosFile = path.join(__dirname, '../data/usuarios.json');
const SECRET_KEY = 'tu-clave-secreta-super-segura-2026';

const leerUsuarios = async () => {
  try {
    const data = await fs.readFile(usuariosFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const escribirUsuarios = async (usuarios) => {
  await fs.writeFile(usuariosFile, JSON.stringify(usuarios, null, 2));
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password requeridos' });
    }

    const usuarios = await leerUsuarios();
    const usuarioExistente = usuarios.find(u => u.username === username);
    
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = {
      id: Date.now(),
      username,
      password: passwordHash
    };

    usuarios.push(nuevoUsuario);
    await escribirUsuarios(usuarios);

    const token = jwt.sign({ id: nuevoUsuario.id, username }, SECRET_KEY);
    res.status(201).json({ token, username });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const usuarios = await leerUsuarios();
    const usuario = usuarios.find(u => u.username === username);
    
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario.id, username: usuario.username }, SECRET_KEY);
    res.json({ token, username: usuario.username });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};

module.exports = { register, login };
