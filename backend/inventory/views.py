from rest_framework import viewsets, permissions
from .models import Producto, Cliente, Venta
from .serializers import ProductoSerializer, ClienteSerializer, VentaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAdminUser]

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [permissions.IsAuthenticated]  # Permite a cualquier usuario autenticado

    def perform_create(self, serializer):
        print("Usuario autenticado:", self.request.user)  # Verifica qué usuario está autenticado
        serializer.save(vendedor=self.request.user)  # Asigna el usuario autenticado como vendedor