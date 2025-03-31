from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

class CustomUserManager(UserManager):
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('rol', 'ADMIN')
        return super().create_superuser(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador'),
        ('VENDEDOR', 'Vendedor'),
    )
    rol = models.CharField(max_length=10, choices=ROLES, default='VENDEDOR')
    email = models.EmailField(unique=True)
    objects = CustomUserManager()
    
    # Campos requeridos
    REQUIRED_FIELDS = ['email', 'rol']

    def __str__(self):
        return self.username