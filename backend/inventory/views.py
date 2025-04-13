from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter
from .models import Product, Customer, Sale
from .serializers import ProductSerializer, CustomerSerializer, SaleSerializer
from rest_framework.permissions import BasePermission

class IsSellerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.rol == 'VENDEDOR' or request.user.rol == 'ADMIN')

class ProductFilter(FilterSet):
    stock__lt = NumberFilter(field_name='stock', lookup_expr='lt')
    
    class Meta:
        model = Product
        fields = ['stock']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'code']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsSellerOrAdmin]

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsSellerOrAdmin]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)