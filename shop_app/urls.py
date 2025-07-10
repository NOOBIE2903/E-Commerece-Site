from django.urls import path
from . import views

urlpatterns = [
    path('api/products/', views.products, name='products'),  # Added 'api/' prefix
    path('api/products/<slug:slug>/', views.product_detail, name="product-detail"),  # Added 'api/' prefix
    path('api/add_item/',  views.add_item ,name="add_item"),
    path("api/product_in_cart/", views.product_in_cart, name="product_in_cart"),
    path("api/get_cart_state/", views.get_cart_state, name="get_cart_state"),
    path("api/get_cart/", views.get_cart, name="get_cart"),
    path("api/get_or_create_user_cart/", views.get_or_create_user_cart, name="get_or_create_user_cart"),
    path("api/associate_cart/", views.associate_cart, name="associate_cart"),
    path("api/update_quantity/", views.update_quantity, name="update_quantity"),
    path("api/delete_cart_item/", views.delete_cart_item, name="delete_cart_item"),
    path("api/user/<int:user_id>/", views.get_user_detals, name="get_user_detals"),
    path("api/add_user/", views.add_user, name="add_user"),
]