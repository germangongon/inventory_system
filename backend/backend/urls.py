from django.urls import include, path
from rest_framework import routers
from users.views import CustomTokenObtainPairView
from inventory.views import ProductoViewSet, ClienteViewSet, VentaViewSet
from rest_framework_simplejwt.views import (TokenRefreshView)

router = routers.DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'ventas', VentaViewSet, basename='venta')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]