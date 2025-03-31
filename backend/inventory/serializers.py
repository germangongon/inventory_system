from rest_framework import serializers
from .models import Producto, Cliente, Venta, DetalleVenta
from django.db import transaction

# ✅ Serializer para productos
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

# ✅ Serializer para clientes (mostramos solo ID y nombre)
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre']

# ✅ Serializer para detalles de la venta
class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_info = ProductoSerializer(source='producto', read_only=True)  # ✅ Muestra info del producto

    class Meta:
        model = DetalleVenta
        fields = ['id', 'producto', 'producto_info', 'cantidad', 'precio_unitario']

# ✅ Serializer para ventas
class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, write_only=True)  # ✅ Solo para input, no output
    detalles_info = DetalleVentaSerializer(source='detalleventa_set', many=True, read_only=True)  # ✅ Para mostrar detalles
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())  # ✅ Permite enviar ID del cliente
    cliente_info = ClienteSerializer(source='cliente', read_only=True)  # ✅ Muestra info del cliente

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_info', 'fecha', 'total', 'detalles', 'detalles_info']

    def create(self, validated_data):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Usuario no autenticado")

        detalles_data = validated_data.pop('detalles')

        with transaction.atomic():
            venta = Venta.objects.create(**validated_data)
            total = 0

            for detalle_data in detalles_data:
                producto = detalle_data['producto']
                
                # Verificamos stock
                if producto.stock < detalle_data['cantidad']:
                    raise serializers.ValidationError(
                        f"Stock insuficiente para {producto.nombre} (quedan {producto.stock} unidades)"
                    )

                # Creamos el detalle de la venta
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=producto,
                    cantidad=detalle_data['cantidad'],
                    precio_unitario=detalle_data['precio_unitario']
                )

                # Actualizamos stock y total
                total += detalle_data['cantidad'] * float(detalle_data['precio_unitario'])
                producto.stock -= detalle_data['cantidad']
                producto.save()

            venta.total = total
            venta.save()

        return venta
