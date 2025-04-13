from django.urls import include, path
from rest_framework import routers
from users.views import CustomTokenObtainPairView
from inventory.views import ProductViewSet, CustomerViewSet, SaleViewSet
from rest_framework_simplejwt.views import (TokenRefreshView)

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'sales', SaleViewSet, basename='sale')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]