# 🏁 Prediction Party - F1 Edition

App de predicciones de F1 para jugar entre amigos. Proyecto hobby ✌️.

---

## 📂 Estructura del proyecto

/f1-prediction-app 
├─ /f1-prediction-frontend --> Frontend (React + MUI) 
│ ├─ .env.local --> Configuración local 
│ ├─ .env.deploy --> Configuración de producción 
├─ /f1-prediction-backend --> Backend (Flask) 
│ └─ .env --> opcional
├─ /scripts --> Scripts automáticos 
│ ├─ deploy.ps1 
│ ├─ localtest.ps1 
│ └─ reset.ps1 
└─ README.md

---

## 💻 Ejecutar en local

1️⃣ Abre terminal en la carpeta raíz `/f1-prediction-app`  
2️⃣ Ejecuta:

.\scripts\localtest.ps1
Este script:

Cambia el .env del frontend a modo local

Levanta el backend local

Levanta el frontend local

## 🚀 Deploy a producción (Railway + Vercel + Git)
1️⃣ Abre terminal en la carpeta raíz
2️⃣ Ejecuta:

.\scripts\deploy.ps1
Este script:

Cambia el .env del frontend a modo producción

Despliega el backend a Railway

Git commit + push

Vercel se encargará solo del deploy al detectar cambios en GitHub

## 🛠 Scripts disponibles

localtest.ps1	Prepara entorno local y levanta backend + frontend
deploy.ps1	Prepara producción y sube backend + frontend
reset.ps1	Limpia y resetea configuraciones

✔️ Notas importantes
El archivo .env del backend NO se usa en producción (Railway lo gestiona).
Frontend se despliega automáticamente en Vercel cuando haces git push.
Revisa siempre tu rama antes de desplegar.

[Editar código] 
      │
      ▼
[Test local con `localtest.ps1`]
      │
      ▼
[Verificar que todo funcione]
      │
      ▼
[Preparar producción con `deploy.ps1`]
      │
      ├─► Cambia a .env.deploy
      ├─► Commit + Push a GitHub
      ├─► Railway detecta y deployea backend
      └─► Vercel detecta y deployea frontend
      │
      ▼
[App en producción]

✔️¿Terminaste las tareas pendientes?
✔️¿Probaste el flujo completo usando localtest.ps1?
✔️¿Verificaste que:
    -Backend responda correctamente
    -Frontend muestre resultados correctos
✔️¿Actualizaste bien los .env locales y de producción?
✔️¿Hiciste git status para asegurarte de que vas a pushear solo lo necesario?
✔️¿Corriste deploy.ps1 desde la carpeta raíz?