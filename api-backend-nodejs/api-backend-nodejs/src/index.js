const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Base de datos en memoria
const db = {
  users: [
    { id: 1, username: 'gestor', password: 'password123', role: 'gestor_logistico' },
    { id: 2, username: 'admin', password: 'admin123', role: 'admin' }
  ],
  transportes: []
};

app.use(cors());
app.use(bodyParser.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Transportes',
      version: '1.0.0',
      description: 'API para gestionar datos de transporte',
    },
  },
  apis: ['./src/index.js'], // archivos que contienen anotaciones
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.get('/items', (req, res) => {
  res.json(db.items);
});

app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = Date.now();
  db.items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/items/:id', (req, res) => {
  const item = db.items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item no encontrado' });
  }
});

// Autenticación simulada
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticar un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       401:
 *         description: Credenciales inválidas
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Middleware para verificar rol
/**
 * @middleware checkRole
 * @description Verifica si el usuario tiene el rol requerido
 * @param {string} role - Rol requerido para acceder a la ruta
 * @returns {function} Middleware de Express
 */
const checkRole = (role) => (req, res, next) => {
  const userId = req.headers['user-id'];
  const user = db.users.find(u => u.id === parseInt(userId));
  if (user && (user.role === role || user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Ruta para registrar un nuevo transporte
/**
 * @swagger
 * /transportes:
 *   post:
 *     summary: Registrar un nuevo transporte
 *     tags: [Transportes]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroViaje
 *               - origen
 *               - destino
 *               - transportista
 *               - tarifaAcordada
 *               - fechaSalida
 *               - fechaEntrega
 *             properties:
 *               numeroViaje:
 *                 type: string
 *               origen:
 *                 type: string
 *               destino:
 *                 type: string
 *               transportista:
 *                 type: string
 *               tarifaAcordada:
 *                 type: number
 *               fechaSalida:
 *                 type: string
 *                 format: date
 *               fechaEntrega:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transporte registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Acceso no autorizado
 */
app.post('/transportes', checkRole('gestor_logistico'), (req, res) => {
  const {
    numeroViaje,
    origen,
    destino,
    transportista,
    tarifaAcordada,
    fechaSalida,
    fechaEntrega
  } = req.body;

  // Validaciones
  if (!numeroViaje || !origen || !destino || !transportista || !tarifaAcordada || !fechaSalida || !fechaEntrega) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (new Date(fechaEntrega) <= new Date(fechaSalida)) {
    return res.status(400).json({ message: 'La fecha de entrega debe ser posterior a la fecha de salida' });
  }

  if (parseFloat(tarifaAcordada) <= 0) {
    return res.status(400).json({ message: 'La tarifa acordada debe ser un número positivo' });
  }

  const newTransporte = {
    id: Date.now(),
    numeroViaje,
    origen,
    destino,
    transportista,
    tarifaAcordada: parseFloat(tarifaAcordada),
    fechaSalida: new Date(fechaSalida),
    fechaEntrega: new Date(fechaEntrega)
  };

  db.transportes.push(newTransporte);
  res.status(201).json({ message: 'Transporte registrado exitosamente', transporte: newTransporte });
});

// Ruta para obtener todos los transportes
/**
 * @swagger
 * /transportes:
 *   get:
 *     summary: Obtener todos los transportes registrados
 *     tags: [Transportes]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: Lista de transportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transporte'
 *       403:
 *         description: Acceso no autorizado
 */
app.get('/transportes', checkRole('gestor_logistico'), (req, res) => {
  res.json(db.transportes);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
