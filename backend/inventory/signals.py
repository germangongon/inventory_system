from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.management import call_command
from django.apps import apps

@receiver(post_migrate)
def load_initial_data(sender, **kwargs):
    # Verificar que la aplicación sea 'inventory'
    if sender.name == 'inventory':
        # Verificar si ya existen productos
        Product = apps.get_model('inventory', 'Product')
        if not Product.objects.exists():
            try:
                # Cargar los datos de prueba
                call_command('loaddata', 'datos_prueba.json', app_label='inventory')
            except Exception as e:
                print(f"Error loading fixtures: {e}")