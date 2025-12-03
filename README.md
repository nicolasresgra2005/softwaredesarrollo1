# Agro-Sense

Agro-Sense es un sistema de monitoreo agrícola que combina hardware (Arduino Nano ESP32 + sensor DHT11) con una plataforma web desarrollada en **React**, **Node.js/Express** y **Supabase (PostgreSQL)**.  
El sistema permite visualizar en tiempo real la humedad y temperatura de cultivos para una gestión más eficiente.

## Hardware utilizado

- **Arduino Nano ESP32**
- **Sensor DHT11 (humedad y temperatura)**
- Comunicación WiFi hacia un servidor local
- Envío de datos hacia la base de datos en Supabase

## Tecnologías del proyecto

- **React + Vite** (frontend)
- **Node.js + Express** (backend)
- **Supabase (PostgreSQL)** como base de datos
- **Arduino IoT** para captura de datos

## Acceso al sistema

El usuario accede a la plataforma mediante la web:

1. Crear una cuenta  
2. Iniciar sesión  
3. Visualizar los datos ambientales en tiempo real

## Estructura

## Estructura del Proyecto

```bash
agro-sense/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── userController.js
│   │
│   ├── jobs/
│   │   └── monitor.js
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │
│   ├── backend/
│   │
│   └── pages/
│       ├── ForgotPassword.css
│       ├── ForgotPassword.jsx
│       ├── header.css
│       ├── header.jsx
│       ├── Home.css
│       ├── Home.jsx
│       ├── InterfaceSensor.css
│       ├── InterfaceSensor.jsx
│       ├── Login.css
│       ├── Login.jsx
│       ├── Perfil.css
│       └── Perfil.jsx
│
├── package.json
└── node_modules/




