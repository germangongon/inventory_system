from django.db import models
from users.models import CustomUser
from decimal import Decimal

class Product(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Customer(models.Model):
    name = models.CharField(max_length=100)
    dni = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name

class Sale(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='sales')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Sale #{self.pk} - {self.date.strftime('%d/%m/%Y')}"

class SaleDetail(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='details')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"