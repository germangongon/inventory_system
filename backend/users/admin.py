from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Nombre correcto del modelo

# Si quieres personalizar el admin para tu usuario
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'rol', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('email', 'telefono')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Roles', {'fields': ('rol',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)  # Registrar el modelo y el admin personalizado