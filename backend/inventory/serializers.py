from rest_framework import serializers
from .models import Product, Customer, Sale, SaleDetail
from django.db import transaction

# ✅ Serializer para productos
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# ✅ Serializer para clientes
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'dni', 'phone', 'address']

# ✅ Serializer para detalles de la venta
class SaleDetailSerializer(serializers.ModelSerializer):
    product_info = ProductSerializer(source='product', read_only=True)  # ✅ Muestra info del producto

    class Meta:
        model = SaleDetail
        fields = ['id', 'product', 'product_info', 'quantity', 'unit_price']

# ✅ Serializer para ventas
class SaleSerializer(serializers.ModelSerializer):
    details = SaleDetailSerializer(many=True, write_only=True)  # ✅ Solo para input, no output
    details_info = SaleDetailSerializer(source='saledetail_set', many=True, read_only=True)  # ✅ Para mostrar detalles
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())  # ✅ Permite enviar ID del cliente
    customer_info = CustomerSerializer(source='customer', read_only=True)  # ✅ Muestra info del cliente

    class Meta:
        model = Sale
        fields = ['id', 'customer', 'customer_info', 'date', 'total', 'details', 'details_info']

    def create(self, validated_data):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User not authenticated")

        details_data = validated_data.pop('details')

        with transaction.atomic():
            sale = Sale.objects.create(**validated_data)
            total = 0

            for detail_data in details_data:
                product = detail_data['product']
                
                # Check stock
                if product.stock < detail_data['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name} (available: {product.stock} units)"
                    )

                # Create sale detail
                SaleDetail.objects.create(
                    sale=sale,
                    product=product,
                    quantity=detail_data['quantity'],
                    unit_price=detail_data['unit_price']
                )

                # Update stock and total
                total += detail_data['quantity'] * float(detail_data['unit_price'])
                product.stock -= detail_data['quantity']
                product.save()

            sale.total = total
            sale.save()

        return sale
