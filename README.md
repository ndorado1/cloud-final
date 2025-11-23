# Aplicación CRUD de Equipos Médicos

Aplicación web completa para la gestión de equipos médicos con backend Django REST Framework y frontend React.

## Características

- ✅ CRUD completo de equipos médicos
- ✅ Dashboard con estadísticas y gráficos
- ✅ Lista de dispositivos con filtros y búsqueda
- ✅ Vista detallada de dispositivos con tabs
- ✅ Formulario de creación/edición de dispositivos
- ✅ Base de datos PostgreSQL
- ✅ API REST con Django REST Framework
- ✅ Frontend React con Vite y Tailwind CSS
- ✅ 15 equipos médicos de muestra incluidos

## Estructura del Proyecto

```
/Users/personal/UAO/Cloud/Final/
├── backend/                    # Django backend
│   ├── medical_devices/       # App principal Django
│   ├── config/                # Configuración Django
│   ├── requirements.txt       # Dependencias Python
│   └── manage.py
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── services/          # API services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── fixtures/              # Datos de muestra (15 equipos)
├── environment.yml            # Conda environment
└── README.md
```

## Requisitos Previos

- Conda (para gestión de entornos)
- PostgreSQL (para base de datos)
- Node.js y npm (para frontend)

## Instalación Local

### 1. Configurar Entorno Conda

```bash
# Crear el entorno conda
conda env create -f environment.yml

# Activar el entorno
conda activate medical-devices-env
```

### 2. Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos PostgreSQL
createdb medical_devices_db

# O usando psql
psql -U postgres
CREATE DATABASE medical_devices_db;
```

### 3. Configurar Backend Django

```bash
cd backend

# Instalar dependencias (si no se instalaron con conda)
pip install -r requirements.txt

# Configurar variables de entorno (opcional, crear archivo .env)
export DB_NAME=medical_devices_db
export DB_USER=postgres
export DB_PASSWORD=tu_password
export DB_HOST=localhost
export DB_PORT=5432

# Ejecutar migraciones
python manage.py migrate

# Cargar datos de muestra (15 equipos médicos)
python manage.py loaddata ../database/fixtures/devices.json

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

### 4. Configurar Frontend React

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Configuración de Producción

### Variables de Entorno Backend

Crear archivo `.env` en la carpeta `backend/`:

```env
SECRET_KEY=tu-secret-key-super-segura
DEBUG=False
DB_NAME=medical_devices_db
DB_USER=postgres
DB_PASSWORD=tu-password
DB_HOST=tu-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
ALLOWED_HOSTS=tu-dominio.com,tu-ip-ec2
```

### Configuración AWS RDS PostgreSQL

1. **Crear instancia RDS PostgreSQL:**
   - Ir a AWS Console > RDS
   - Crear base de datos PostgreSQL
   - Configurar seguridad: VPC, Security Groups
   - Guardar endpoint, puerto, usuario y contraseña

2. **Configurar Security Group:**
   - Permitir tráfico PostgreSQL (puerto 5432) desde tu EC2 instance

### Despliegue en AWS EC2

1. **Preparar instancia EC2:**
   ```bash
   # Conectar a tu instancia EC2
   ssh -i tu-key.pem ubuntu@tu-ec2-ip

   # Instalar dependencias
   sudo apt update
   sudo apt install -y python3-pip postgresql-client nginx

   # Instalar Conda (opcional, o usar venv)
   wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
   bash Miniconda3-latest-Linux-x86_64.sh
   ```

2. **Clonar y configurar proyecto:**
   ```bash
   git clone tu-repositorio
   cd Final

   # Crear entorno conda
   conda env create -f environment.yml
   conda activate medical-devices-env

   # Configurar backend
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py loaddata ../database/fixtures/devices.json
   python manage.py collectstatic --noinput
   ```

3. **Configurar Gunicorn:**
   ```bash
   pip install gunicorn
   
   # Crear archivo gunicorn_config.py
   # bind = "0.0.0.0:8000"
   # workers = 3
   ```

4. **Configurar Nginx:**
   Crear archivo `/etc/nginx/sites-available/medical-devices`:
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location /api {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           root /path/to/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Configurar Systemd Service:**
   Crear archivo `/etc/systemd/system/medical-devices.service`:
   ```ini
   [Unit]
   Description=Medical Devices Django App
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/Final/backend
   Environment="PATH=/home/ubuntu/miniconda3/envs/medical-devices-env/bin"
   ExecStart=/home/ubuntu/miniconda3/envs/medical-devices-env/bin/gunicorn config.wsgi:application --config gunicorn_config.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable medical-devices
   sudo systemctl start medical-devices
   ```

### Despliegue Frontend

```bash
cd frontend

# Construir para producción
npm run build

# Los archivos estarán en frontend/dist/
# Copiar a servidor web estático o servir con Nginx
```

## Endpoints API

- `GET /api/devices/` - Listar todos los dispositivos
- `GET /api/devices/{id}/` - Obtener dispositivo por ID
- `POST /api/devices/` - Crear nuevo dispositivo
- `PUT /api/devices/{id}/` - Actualizar dispositivo
- `DELETE /api/devices/{id}/` - Eliminar dispositivo
- `GET /api/devices/statistics/` - Obtener estadísticas del dashboard
- `GET /api/maintenance/` - Listar registros de mantenimiento
- `GET /api/documents/` - Listar documentos

## Datos de Muestra

El proyecto incluye 15 equipos médicos de muestra con datos realistas:
- Bombas de infusión
- Ventiladores
- Monitores ECG
- Equipos de imagenología
- Y más...

Para cargar los datos:
```bash
python manage.py loaddata database/fixtures/devices.json
```

## Tecnologías Utilizadas

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- psycopg2-binary

### Frontend
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.3.6
- React Router DOM 6.20.0
- Axios 1.6.2

## Desarrollo

### Ejecutar Tests (Backend)
```bash
cd backend
python manage.py test
```

### Ejecutar Linter (Frontend)
```bash
cd frontend
npm run lint
```

## Solución de Problemas

### Error de conexión a PostgreSQL
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en settings.py
- Verificar que la base de datos exista

### Error CORS
- Verificar configuración CORS_ALLOWED_ORIGINS en settings.py
- En desarrollo, CORS_ALLOW_ALL_ORIGINS=True está habilitado

### Error al cargar fixtures
- Verificar que las migraciones se hayan ejecutado
- Verificar formato JSON del fixture

## Licencia

Este proyecto es parte de un trabajo final de maestría.

## Autor

Desarrollado para proyecto final de maestría en Cloud Computing.

