# Portafolio - Miguel Ángel Reyes Torres

Desarrollador Full Stack con enfoque en IA.

## Estructura

```
├── backend/     # Servidor Express (API del chat)
└── frontend/    # Aplicación Angular
```

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Configuración

### Backend

1. Renombra el archivo `.env.example` a `.env` en la carpeta `backend/`:

```bash
cd backend
mv .env.example .env
```

2. Edita `.env` y agrega tu token de HuggingFace:

```env
HF_TOKEN=tu_token_aqui
```

**Nota:** El archivo `.env` está protegido en `.gitignore` y no se subirá a GitHub.

## Ejecución

### Desarrollo (ambas partes)

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

El frontend se ejecutará en `http://localhost:4200` y el backend en `http://localhost:3000`.

### Producción

```bash
# Build del frontend
cd frontend
npm run build

# El backend sirve la API en el puerto 3000
cd ../backend
npm start
```

## Funcionalidades

- Chat con IA (HuggingFace Llama 3.2)
- Formulario de contacto (EmailJS)
- Portafolio profesional

## Tech Stack

- **Frontend:** Angular, TypeScript, RxJS
- **Backend:** Node.js, Express
- **IA:** HuggingFace API
