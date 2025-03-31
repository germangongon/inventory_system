from django.db import models
from users.models import CustomUser

class Producto(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    dni = models.CharField(max_length=15, unique=True)
    direccion = models.TextField(blank=True)
    telefono = models.CharField(max_length=15)
    
    def __str__(self):
        return self.nombre

class Venta(models.Model):
    vendedor = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='ventas')
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-fecha']
    
    def __str__(self):
        return f"Venta #{self.id} - {self.fecha.strftime('%d/%m/%Y')}"

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        # Actualizar stock al guardar
        self.producto.stock -= self.cantidad
        self.producto.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre}"