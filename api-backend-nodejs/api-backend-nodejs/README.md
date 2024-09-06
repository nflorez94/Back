# API de Gestión de Transportes

Este proyecto es una API backend desarrollada con Node.js y Express para gestionar datos de transporte. Utiliza una base de datos en memoria y proporciona documentación de la API con Swagger.

## Características

- Autenticación simulada de usuarios
- Base de datos en memoria
- Documentación de API con Swagger

## Requisitos previos

- Node.js (versión LTS recomendada)
- npm (normalmente viene con Node.js)

## Instalación

1. Clona este repositorio:
   ```
   git clone [URL_DEL_REPOSITORIO]
   cd api-backend-nodejs
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar el servidor:

```
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## Endpoints

- `POST /login`: Autenticación de usuarios
- `POST /transportes`: Registrar un nuevo transporte (requiere autenticación)
- `GET /transportes`: Obtener todos los transportes registrados (requiere autenticación)

## Documentación de la API

La documentación de la API está disponible en la ruta `/api-docs` una vez que el servidor esté en ejecución. Puedes acceder a ella en tu navegador visitando `http://localhost:3000/api-docs`.

## Estructura del proyecto

```
api-backend-nodejs/
├── src/
│   └── index.js    # Archivo principal del servidor
├── package.json
└── README.md
```

## Desarrollo

El archivo principal `src/index.js` contiene:

- Configuración de Express y middleware
- Definición de la base de datos en memoria
- Configuración de Swagger
- Definición de rutas de ejemplo

## Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo `package.json` para más detalles.
