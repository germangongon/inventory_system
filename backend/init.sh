#!/bin/bash

# Aplicar migraciones
python manage.py migrate

# Crear usuario admin si no existe
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123', rol='ADMIN')
    print('Usuario admin creado')
else:
    print('Usuario admin ya existe')
"

# Iniciar el servidor
python manage.py runserver 0.0.0.0:8000 